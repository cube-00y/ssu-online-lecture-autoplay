import { BrowserContext } from 'playwright';

type Props = {
  url: string;
  onConsole?(event: { type: string; } & Record<string, unknown>): void;
};

export async function play (context: BrowserContext, props: Props) {
  const { url, onConsole } = props;
  // const page = await context.newPage();
  // await page.goto(url);
  // await page.waitForSelector('#tool_content');
  // const firstFrame = (await (await page.$('#tool_content'))!.contentFrame())!;
  // await firstFrame.waitForSelector('.xn-content-frame');
  // const secondFrame = (await (await firstFrame.$('.xn-content-frame'))!.contentFrame())!;
  // await secondFrame.waitForLoadState('load');
  // await secondFrame.waitForSelector('.vc-front-screen-play-btn');
  // await secondFrame.click('.vc-front-screen-play-btn');
  const page = await context.newPage();
  await page.goto(url);
  // await page.waitForSelector('#front-screen');
  // const firstFrame = (await (await page.$('#front-screen'))!.contentFrame())!;
  // await firstFrame.waitForSelector('.vc-front-screen-thumbnail-container');
  // const secondFrame = (await (await firstFrame.$('.vc-front-screen-thumbnail-container'))!.contentFrame())!;
  // await secondFrame.waitForLoadState('load');
  // await secondFrame.waitForSelector('.vc-front-screen-play-btn');
  await page.click('.vc-front-screen-play-btn');

  try {
    await (await page.$('.vc-pctrl-volume-btn:not(.muted)'))?.click();
  } catch {}

  try {
    await page.click('.confirm-ok-btn', { timeout: 10000 });
  } catch {}

  try {
    await (await page.$('.vc-pctrl-playback-rate-toggle-btn'))?.click();
  } catch {}

  try {
    const playbackRate = process.env.PLAYBACK_LATE || "2.0"
    await (await page.$(`.vc-pctrl-playback-rate-btn:is(:text("${playbackRate}"))`))?.click();
  } catch {}
  page.on('dialog', async dialog => await dialog.accept());
  page.on('console', async message => {
    if (message.args().length && message.text() === 'JSHandle@object') {
      try {
        const event = await message.args()[0].jsonValue();
        if (typeof event === 'object' && 'type' in event) {
          onConsole?.(event);
        }
      } catch {}
    }
  });
  onConsole && await page.exposeFunction('onConsole', onConsole);
  while (1) {
    try {
      await page.evaluate(() => {
        return new Promise<void>((resolve, reject) => {
            function progressStart () {
              // Check currentTime from seek thumb style mutation
              let prevCurrentTime = 0;
              const currentTimeEl = document.querySelector('.vc-pctrl-curr-time')!;
              const progressMutation = new MutationObserver(() => {
                const currentTimeText = currentTimeEl.textContent!;
                const currentTime = currentTimeText.split(':').map(Number).reverse().reduce((result, value, index) => {
                  return result + (value * Math.pow(60, index));
                }, 0);
                if (prevCurrentTime !== currentTime) {
                  onConsole?.({
                    type: 'timeupdate',
                    currentTime: currentTime
                  });
                }
                prevCurrentTime = currentTime;
              });
              progressMutation.observe(document.querySelector('.vc-pctrl-seek-thumb')!, {
                attributes: true
              });
            }

            // Check intro is pass from playProgress should move
            const introMutation = new MutationObserver(() => {
              onConsole?.({ type: 'intro' });
              introMutation.disconnect();
              progressStart();
            });
            introMutation.observe(document.querySelector('.vc-pctrl-play-progress')!, {
              attributes: true
            });

            // Check resolve from retry screen is opened
            const retryContainer = document.querySelector('#player-center-control') as HTMLDivElement;
            const retryMutation = new MutationObserver(() => {
              if (retryContainer.style.display && retryContainer.style.display !== 'none') {
                onConsole?.({
                  type: 'end'
                });
                window.setTimeout(() => {
                  resolve();
                }, 5000);
              }
            });
            retryMutation.observe(retryContainer, {
              attributes: true
            });

            // Check confirm dialog if opened
            const confirmDialog = document.querySelector('#confirm-dialog') as HTMLDivElement;
            const confirmMutation = new MutationObserver(() => {
              if (confirmDialog.style.display && confirmDialog.style.display !== 'none') {
                (confirmDialog.querySelector('.confirm-ok-btn') as HTMLDivElement).click();
              }
            });
            confirmMutation.observe(confirmDialog, {
              attributes: true
            });

            // Check duplicate dialog if opened
            const duplicateDialog = document.querySelector('#warn-duplicate-contents-msg') as HTMLDivElement;
            const duplicateMutation = new MutationObserver(() => {
              if (confirmDialog.style.display && confirmDialog.style.display !== 'none') {
                location.reload();
                reject(new Error('reload'));
              }
            });
            duplicateMutation.observe(duplicateDialog, {
              attributes: true
            });
        });
      });
      break;
    } catch (err) {
      if (!(err instanceof Error && err.message === 'reload')) {
        throw err;
      }
    }
  }
  await page.close();
}
