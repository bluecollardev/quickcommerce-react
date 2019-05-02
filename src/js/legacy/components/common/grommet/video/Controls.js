import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Button from '../Button';
import Box from '../Box';
import Heading from '../Heading';
import VideoTime from './Time';
import VideoFullscreenButton from './FullscreenButton';
import VideoProgressBar from './ProgressBar';
import VideoPlayButton from './PlayButton';
import CSSClassnames from '../../../utils/CSSClassnames';
import Intl from '../../../utils/Intl';
import { formatTime } from '../../../utils/FormatTime';

const CLASS_ROOT = CSSClassnames.VIDEO;
const BUTTON_CLASS = `${CLASS_ROOT}__button`;

export default class Controls extends Component {

  constructor () {
    super();

    this.onChapterTickHover = this.onChapterTickHover.bind(this);

    this.state = {
      activeChapterIndex: undefined
    };
  }

  onChapterTickHover (index) {
    this.setState({activeChapterIndex: index});
  }

  renderTitle () {
    let title;
    if (this.props.title) {
      title = (
        <Box pad={{ horizontal: 'small', vertical: 'none' }}>
          <Heading tag="h3" margin="none">{this.props.title}</Heading>
        </Box>
      );
    }

    return title;
  }

  renderMuteButton () {
    const { muted, toggleMute } = this.props;
    const { intl } = this.context;
    let buttonMessage = Intl.getMessage(intl, 'Mute');
    let Icon = VolumeMuteIcon;
    if (muted) {
      Icon = VolumeIcon;
      buttonMessage = Intl.getMessage(intl, 'Unmute');
    }
    return (
      <Button plain={true} onClick={toggleMute} className={BUTTON_CLASS}
        a11yTitle={buttonMessage}>
        <Icon className={`${BUTTON_CLASS}__icon`} colorIndex='brand' />
      </Button>
    );
  }

  renderChapterLabels () {
    const { duration, timeline, ...props } = this.props;
    const { activeChapterIndex } = this.state;

    if (timeline) {
      let chapterLabels = timeline.map((chapter, index, chapters) => {
        let percent = (chapter.time / duration) * 100;
        let classes = classnames(
          `${CLASS_ROOT}__chapter-label`,
          {
            [`${CLASS_ROOT}__chapter-label-start`]: percent === 0,
            [`${CLASS_ROOT}__chapter-label-active`]:
              activeChapterIndex === index
          }
        );

        return (
          <div className={classes} key={chapter.label}
            style={{left: `${percent}%`}}>
            <span>{chapter.label}</span>
            <span>{formatTime(chapter.time)}</span>
          </div>
        );
      });

      return (
        <Box {...props} pad="none" className={`${CLASS_ROOT}__chapter-labels`}
          direction="row">
          {chapterLabels}
        </Box>
      );
    }
  }

  render() {
    const {
      togglePlay,
      hasPlayed,
      playing,
      ended,
      currentTime,
      duration,
      percentagePlayed,
      seek,
      timeline,
      allowFullScreen,
      fullscreen
    } = this.props;

    if (!hasPlayed) {
      return null;
    }

    let overlayContent = (
      <Box pad="none" className={`${CLASS_ROOT}__controls`}
        direction="column" justify="start">
        <VideoProgressBar progress={percentagePlayed}
          onChapterHover={this.onChapterTickHover}
          duration={duration} onChange={seek} timeline={timeline} />
        {timeline ? this.renderChapterLabels() : undefined}
        <Box pad="none" className={`${CLASS_ROOT}__controls-primary`}
          direction="row" justify="between">
          <Box direction="row" align="center"
            pad={{ horizontal: 'small', vertical: 'none'}}>
            <VideoPlayButton playing={playing} ended={ended} iconSize='medium'
              togglePlay={togglePlay} primary={false} />
            {this.renderTitle()}
          </Box>
          <Box direction="row" align="center"
            pad={{ horizontal: 'small', vertical: 'none'}}>
            <VideoTime currentTime={currentTime} duration={duration} />
            {this.renderMuteButton()}
            {allowFullScreen ?
              <VideoFullscreenButton onClick={fullscreen} /> : undefined}
          </Box>
       </Box>
      </Box>
    );

    return overlayContent;
  }
}

Controls.contextTypes = {
  intl: PropTypes.object
};
