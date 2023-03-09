# 숭실대 온라인 강의 손가락 까닥 안하고 이어 듣기

![image](https://user-images.githubusercontent.com/7782413/117742467-d586d800-b23f-11eb-9382-4129d7c6d396.png)

매번 강의 끝날때마다 마우스 움직이는게 귀찮아서 만들었습니다. 절대 밤에 틀어놓고 잘려고 하는 목적이 아니니 오해는 삼가 해주세요 ^^~

```bash
git clone https://github.com/minuukang/ssu-online-lecture-autoplay
cd ssu-online-lecture-autoplay
npm i
npm start
```

![image](./.github/ezgif-7-05614e2be852.gif)

자동으로 미수강 강의 중에서 현재 주차 강의를 찾아서 재생을 순차적으로 진행합니다.

매번 아이디 비밀번호 치는게 귀찮다면 `.env.example` 파일을 `.env` 로 복사해서 `SSU_ID` 와 `SSU_PASSWORD` 필드를 채워넣으세요

(있을지 모르겠지만!) 동영상 재생을 백그라운드에서 하고 싶다면 `.env` 에서 `PLAY_BACKGROUND` 옵션을 채워놓으세요. 브라우저를 headless로 전환합니다.

## 듣고싶지 않은 강의 (F를 원하는 강의)가 있을 경우?

`.env` 에 `IGNORE_COURSE_IDS` 에 id값을 "," 로 구분지어 채워 놓습니다. id값은 스마트캠퍼스에서 해당 강의의 url인 "https://canvas.ssu.ac.kr/courses/7819" 에서 "7819" 에 해당하는 부분입니다.

## 강의 배속을 설정하고 싶은 경우?

`.env` 에 `PLAYBACK_LATE` 에 원하는 배속(`0.5` `1.0` `1.25` `1.5` `2.0`)을 채워넣습니다.<br>
`PLAYBACK_LATE` 변수의 기본값은 `2.0` 입니다.
