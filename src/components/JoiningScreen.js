import { Box, useTheme, Grid, makeStyles, IconButton } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";

import useResponsiveSize from "../utils/useResponsiveSize";
import { MeetingDetailsScreen } from "./MeetingDetailsScreen";
import { createMeeting, getToken, validateMeeting } from "../api";

import logo from "../public/images/logo.png";
import logoWhite from "../public/images/logo-white.png";

const useStyles = makeStyles((theme) => ({
  video: {
    borderRadius: "10px",
    backgroundColor: "#1c1c1c",
    height: "100%",
    width: "100%",
    objectFit: "cover",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  toggleButton: {
    borderRadius: "100%",
    minWidth: "auto",
    width: "44px",
    height: "44px",
  },

  previewBox: {
    width: "100%",
    height: "45vh",
    position: "relative",
  },
}));

export function JoiningScreen({
  participantName,
  setParticipantName,
  meetingId,
  setMeetingId,
  setToken,
  setWebcamOn,
  setMicOn,
  micOn,
  webcamOn,
  onClickStartMeeting,
}) {
  const [readyToJoin, setReadyToJoin] = useState(false);
  const videoPlayerRef = useRef();
  const theme = useTheme();
  const styles = useStyles(theme);

  const [videoTrack, setVideoTrack] = useState(null);

  const padding = useResponsiveSize({
    xl: 6,
    lg: 6,
    md: 6,
    sm: 4,
    xs: 1.5,
  });

  const _handleToggleMic = () => {
    setMicOn(!micOn);
  };
  const _handleToggleWebcam = () => {
    if (!webcamOn) {
      getVideo();
    } else {
      if (videoTrack) {
        videoTrack.stop();
        setVideoTrack(null);
      }
    }
    setWebcamOn(!webcamOn);
  };

  const getVideo = async () => {
    if (videoPlayerRef.current) {
      const videoConstraints = {
        video: {
          width: 800,
          height: 500,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(
        videoConstraints
      );
      const videoTracks = stream.getVideoTracks();

      const videoTrack = videoTracks.length ? videoTracks[0] : null;

      videoPlayerRef.current.srcObject = new MediaStream([videoTrack]);
      videoPlayerRef.current.play();

      setVideoTrack(videoTrack);
    }
  };

  useEffect(() => {
    setParticipantName(Math.random() * 100);
  }, []);

  useEffect(() => {
    if (webcamOn && !videoTrack) {
      getVideo();
    }
  }, [webcamOn]);

  return (
    <Box
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        height: "100vh",
        alignItems: "center",
        backgroundColor: "#fff4f5",
        padding: padding,
      }}
    >
      {readyToJoin ? (
        <Box
          position="absolute"
          style={{
            top: theme.spacing(2),
            right: 0,
            left: theme.spacing(2),
          }}
        >
          <IconButton
            onClick={() => {
              setReadyToJoin(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24px"
              height="24px"
              viewBox="0 0 448 512"
              fill="#373750"
            >
              <path d="M447.1 256C447.1 273.7 433.7 288 416 288H109.3l105.4 105.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L109.3 224H416C433.7 224 447.1 238.3 447.1 256z" />
            </svg>
          </IconButton>
        </Box>
      ) : null}
      <Grid
        item
        xs={12}
        md={6}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {readyToJoin ? (
          <div className="join_container">
            <div
              className={styles.video_container}
              style={{
                minWidth: "800px",
                height: "500px",
                backgroundColor: "#373750",
                borderRadius: "10px",
                position: "relative",
              }}
            >
              {webcamOn && <video ref={videoPlayerRef} />}
              <div
                className={styles.logoWrapper}
                style={{ position: "absolute", bottom: "20px", right: "20px" }}
              >
                <img src={webcamOn ? logo : logoWhite} width={55} height={40} />
              </div>

              <div
                style={{
                  width: "60px",
                  height: "60px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid white",
                  borderRadius: "50%",
                  cursor: "pointer",
                  position: "absolute",
                  bottom: "20px",
                  left: "55%",
                  backgroundColor: !webcamOn && "red",
                }}
                onClick={_handleToggleWebcam}
              >
                {webcamOn ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="#fff"
                    viewBox="0 0 576 512"
                  >
                    <path d="M384 112v288c0 26.51-21.49 48-48 48h-288c-26.51 0-48-21.49-48-48v-288c0-26.51 21.49-48 48-48h288C362.5 64 384 85.49 384 112zM576 127.5v256.9c0 25.5-29.17 40.39-50.39 25.79L416 334.7V177.3l109.6-75.56C546.9 87.13 576 102.1 576 127.5z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="#fff"
                    viewBox="0 0 640 512"
                  >
                    <path d="M32 399.1c0 26.51 21.49 47.1 47.1 47.1h287.1c19.57 0 36.34-11.75 43.81-28.56L32 121.8L32 399.1zM630.8 469.1l-89.21-69.92l15.99 11.02c21.22 14.59 50.41-.2971 50.41-25.8V127.5c0-25.41-29.07-40.37-50.39-25.76l-109.6 75.56l.0001 148.5l-32-25.08l.0001-188.7c0-26.51-21.49-47.1-47.1-47.1H113.9L38.81 5.111C34.41 1.673 29.19 0 24.03 0C16.91 0 9.84 3.158 5.121 9.189C-3.066 19.63-1.249 34.72 9.189 42.89l591.1 463.1c10.5 8.203 25.57 6.328 33.69-4.078C643.1 492.4 641.2 477.3 630.8 469.1z" />
                  </svg>
                )}
              </div>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid white",
                  borderRadius: "50%",
                  cursor: "pointer",
                  position: "absolute",
                  bottom: "20px",
                  left: "40%",
                  backgroundColor: !micOn && "red",
                }}
                onClick={_handleToggleMic}
              >
                {micOn ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="#fff"
                    viewBox="0 0 640 512"
                  >
                    <path d="M412.6 182c-10.28-8.334-25.41-6.867-33.75 3.402c-8.406 10.24-6.906 25.35 3.375 33.74C393.5 228.4 400 241.8 400 255.1c0 14.17-6.5 27.59-17.81 36.83c-10.28 8.396-11.78 23.5-3.375 33.74c4.719 5.806 11.62 8.802 18.56 8.802c5.344 0 10.75-1.779 15.19-5.399C435.1 311.5 448 284.6 448 255.1S435.1 200.4 412.6 182zM473.1 108.2c-10.22-8.334-25.34-6.898-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C476.6 172.1 496 213.3 496 255.1s-19.44 82.1-53.31 110.7c-10.25 8.396-11.75 23.5-3.344 33.74c4.75 5.775 11.62 8.771 18.56 8.771c5.375 0 10.75-1.779 15.22-5.431C518.2 366.9 544 313 544 255.1S518.2 145 473.1 108.2zM534.4 33.4c-10.22-8.334-25.34-6.867-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C559.9 116.3 592 183.9 592 255.1s-32.09 139.7-88.06 185.5c-10.25 8.396-11.75 23.5-3.344 33.74C505.3 481 512.2 484 519.2 484c5.375 0 10.75-1.779 15.22-5.431C601.5 423.6 640 342.5 640 255.1S601.5 88.34 534.4 33.4zM301.2 34.98c-11.5-5.181-25.01-3.076-34.43 5.29L131.8 160.1H48c-26.51 0-48 21.48-48 47.96v95.92c0 26.48 21.49 47.96 48 47.96h83.84l134.9 119.8C272.7 477 280.3 479.8 288 479.8c4.438 0 8.959-.9314 13.16-2.835C312.7 471.8 320 460.4 320 447.9V64.12C320 51.55 312.7 40.13 301.2 34.98z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="#fff"
                    viewBox="0 0 576 512"
                  >
                    <path d="M301.2 34.85c-11.5-5.188-25.02-3.122-34.44 5.253L131.8 160H48c-26.51 0-48 21.49-48 47.1v95.1c0 26.51 21.49 47.1 48 47.1h83.84l134.9 119.9c5.984 5.312 13.58 8.094 21.26 8.094c4.438 0 8.972-.9375 13.17-2.844c11.5-5.156 18.82-16.56 18.82-29.16V64C319.1 51.41 312.7 40 301.2 34.85zM513.9 255.1l47.03-47.03c9.375-9.375 9.375-24.56 0-33.94s-24.56-9.375-33.94 0L480 222.1L432.1 175c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94l47.03 47.03l-47.03 47.03c-9.375 9.375-9.375 24.56 0 33.94c9.373 9.373 24.56 9.381 33.94 0L480 289.9l47.03 47.03c9.373 9.373 24.56 9.381 33.94 0c9.375-9.375 9.375-24.56 0-33.94L513.9 255.1z" />
                  </svg>
                )}
              </div>
            </div>
            <div className={"ready_to_join_container"}>
              <div className="head">Ready to join ?</div>
              <button
                onClick={(e) => {
                  if (videoTrack) {
                    videoTrack.stop();
                    setVideoTrack(null);
                  }
                  onClickStartMeeting();
                }}
              >
                Join now
              </button>
            </div>
          </div>
        ) : (
          <MeetingDetailsScreen
            onClickJoin={async (id) => {
              const token = await getToken();
              const valid = await validateMeeting({ meetingId: id, token });
              if (valid) {
                setReadyToJoin(true);
                setToken(token);
                setMeetingId(id);
                setWebcamOn(true);
                setMicOn(true);
              } else alert("Invalid Meeting Id");
            }}
            onClickCreateMeeting={async () => {
              const token = await getToken();
              const _meetingId = await createMeeting({ token });
              setToken(token);
              setMeetingId(_meetingId);
              setReadyToJoin(true);
              setWebcamOn(true);
              setMicOn(true);
            }}
          />
        )}
      </Grid>
    </Box>
  );
}
