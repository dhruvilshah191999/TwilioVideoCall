import React from 'react';
import Button from '@material-ui/core/Button';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import useChatContext from '../../../hooks/useChatContext/useChatContext';
import BackgroundIcon from '../../../icons/BackgroundIcon';

const useStyles = makeStyles(() =>
  createStyles({
    iconContainer: {
      position: 'relative',
      display: 'flex',
    },
  })
);
interface IToggleParticipantButtonProps {
  disabled?: boolean;
  className?: string;
}

const ToggleParticipantButton: React.FC<IToggleParticipantButtonProps> = ({ disabled, className }) => {
  const classes = useStyles();
  const { setIsChatWindowOpen } = useChatContext();
  const { setIsParticipantWindowOpen } = useVideoContext();

  const handleParticipantClick = () => {
    setIsParticipantWindowOpen(true);
    setIsChatWindowOpen(false);
  };

  return (
    <Button
      className={className}
      onClick={handleParticipantClick}
      disabled={disabled}
      startIcon={
        <div className={classes.iconContainer}>
          <BackgroundIcon />
        </div>
      }
    >
      People
    </Button>
  );
};

export default ToggleParticipantButton;
