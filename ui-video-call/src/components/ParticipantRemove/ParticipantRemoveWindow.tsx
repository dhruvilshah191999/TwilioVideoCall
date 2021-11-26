/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import videoSessionService from '../../service/video-session-service';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import CloseIcon from '../../icons/CloseIcon';
import { Button } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    display: 'flex',
    width: 320,
    height: `calc(100% - 150px)`,
    top: '81px',
    zIndex: 9,
  },
  container: {
    minHeight: '56px',
    background: '#F4F4F6',
    borderBottom: '1px solid #E4E7E9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 1em',
  },
  text: {
    fontWeight: 'bold',
  },
  closeBackgroundSelection: {
    cursor: 'pointer',
    display: 'flex',
    background: 'transparent',
    border: '0',
    padding: '0.4em',
  },
  participantDetail: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '10px',
  },
  participantName: {
    width: '110px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: 0,
  },
  participateWindowContainer: {
    background: '#FFFFFF',
    zIndex: 9,
    minWidth: 320,
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid #E4E7E9',
    [theme.breakpoints.down('sm')]: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      zIndex: 100,
      width: '250px',
      maxWidth: '100%',
    },
  },
  hide: {
    display: 'none',
  },
}));

const ParticipantRemoveWindow = () => {
  const classes = useStyles();
  const participants = useParticipants();
  const { room, isParticipantWindowOpen, setIsParticipantWindowOpen } = useVideoContext();
  const [participantList, setParticipantList] = React.useState([]);

  const getParticipantList = async () => {
    console.log(participants);
    await videoSessionService.participantList(room!.sid).then(response => {
      setParticipantList(response.data);
    });
  };

  React.useEffect(() => {
    getParticipantList();
  }, [participants]);

  const removeParticipant = async (participantId: string) => {
    await videoSessionService.removeParticipant(room!.sid, participantId);
  };

  return (
    <aside className={clsx(classes.participateWindowContainer, { [classes.hide]: !isParticipantWindowOpen })}>
      <div className={classes.container}>
        <div className={classes.text}>People</div>
        <button className={classes.closeBackgroundSelection} onClick={() => setIsParticipantWindowOpen(false)}>
          <CloseIcon />
        </button>
      </div>
      <div>
        {participantList?.length !== 0 &&
          participantList?.map((pt: any, i) => {
            return (
              <div key={i} className={classes.participantDetail}>
                {pt!.sid !== room?.localParticipant?.sid ? (
                  <>
                    <p className={classes.participantName}>{pt.identity}</p>
                    <Button variant="contained" color="primary" onClick={() => removeParticipant(pt.sid)}>
                      Remove
                    </Button>
                  </>
                ) : (
                  <>
                    <p className={classes.participantName}>You</p>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </aside>
  );
};

export default ParticipantRemoveWindow;
