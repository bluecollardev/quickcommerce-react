// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';
import CSSClassnames from '../../utils/CSSClassnames';
import Props from '../../utils/Props';
import VideoControls from './video/Controls';
import VideoOverlay from './video/Overlay';
import throttle from '../../utils/Throttle';

const CLASS_ROOT = CSSClassnames.VIDEO;
const BACKGROUND_COLOR_INDEX = CSSClassnames.BACKGROUND_COLOR_INDEX;

export default class Video extends Component {

  constructor(props, context) {
    super(props, context);

    this.hasPlayed = false;
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.toggleMute = this.toggleMute.bind(this);
    this.seek = this.seek.bind(this);
    this.mute = this.mute.bind(this);
    this.unmute = this.unmute.bind(this);
    this.fullscreen = this.fullscreen.bind(this);
    this.onInterationStart = this.onInterationStart.bind(this);
    this.onInteractionOver = this.onInteractionOver.bind(this);
    this.renderControls = this.renderControls.bind(this);

    this.state = {
      mouseActive: false
    };
  }

  componentWillMount () {
    this.update = throttle(this.update.bind(this), 100, this);
    this.mediaEventProps = this.injectUpdateVideoEvents();
  }

  componentWillReceiveProps (nextProps) {
    // Dynamically modifying a source element and its attribute when
    // the element is already inserted in a video or audio element will
    // have no effect.
    // From HTML Specs:
    // https://html.spec.whatwg.org/multipage/embedded-content.html
    //   #the-source-element
    // Using forceUpdate to force redraw of video when receiving new <source>
    this.forceUpdate();
  }

  injectUpdateVideoEvents () {
    const videoEvents = [
      'onAbort',
      'onCanPlay',
      'onCanPlayThrough',
      'onDurationChange',
      'onEmptied',
      'onEncrypted',
      'onEnded',
      'onError',
      'onLoadedData',
      'onLoadedMetadata',
      'onLoadStart',
      'onPause',
      'onPlay',
      'onPlaying',
      'onProgress',
      'onRateChange',
      'onSeeked',
      'onSeeking',
      'onStalled',
      'onSuspend',
      'onTimeUpdate',
      'onVolumeChange',
      'onWaiting'
    ];

    return videoEvents.reduce((previousValue, currentValue) => {
      previousValue[currentValue] = () => {
        if (currentValue in this.props
          && typeof this.props[currentValue] === 'function') {
          this.props[currentValue]();
        }
        this.update();
      };

      return previousValue;
    }, {});
  }

  update () {
    // Set flag for Video first play
    if (!this.hasPlayed && !this.video.paused && !this.video.loading) {
      this.hasPlayed = true;
    }

    let interacting = this.state.interacting;
    if (this.video.ended) {
      interacting = false;
    };

    this.setState({
      duration: this.video.duration,
      currentTime: this.video.currentTime,
      buffered: this.video.buffered,
      paused: this.video.paused,
      muted: this.video.muted,
      volume: this.video.volume,
      ended: this.video.ended,
      readyState: this.video.readyState,
      interacting: interacting,
      // computed values
      hasPlayed: this.hasPlayed,
      playing: !this.video.paused && !this.video.loading,
      percentageBuffered: this.video.buffered.length &&
        this.video.buffered.end(this.video.buffered.length - 1) /
        this.video.duration * 100,
      percentagePlayed: this.video.currentTime / this.video.duration * 100,
      loading: this.video.readyState < this.video.HAVE_ENOUGH_DATA
    });
  }

  play () {
    this.video.play();
  }

  pause () {
    this.video.pause();
  }

  togglePlay () {
    if (this.state.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  seek(time) {
    this.video.currentTime = typeof time !== 'undefined'
      ? time
      : this.video.currentTime;
  }

  unmute() {
    this.video.muted = false;
  }

  mute() {
    this.video.muted = true;
  }

  toggleMute () {
    if (!this.state.muted) {
      this.mute();
    } else {
      this.unmute();
    }
  }

  fullscreen() {
    if (this.video.requestFullscreen) {
      this.video.requestFullscreen();
    } else if (this.video.msRequestFullscreen) {
      this.video.msRequestFullscreen();
    } else if (this.video.mozRequestFullScreen) {
      this.video.mozRequestFullScreen();
    } else if (this.video.webkitRequestFullscreen) {
      this.video.webkitRequestFullscreen();
    } else {
      console.warn('Your browser doesn\'t support fullscreen.');
    }
  }

  onInterationStart () {
    this.setState({ interacting: true });
  }

  onInteractionOver () {
    const { focus } = this.state;
    if (!focus) {
      this.setState({ interacting: false });
    }
  }

  renderControls () {
    let extendedProps = Object.assign({
      title: this.props.title,
      togglePlay: this.togglePlay,
      toggleMute: this.toggleMute,
      play: this.play,
      pause: this.pause,
      mute: this.mute,
      unmute: this.unmute,
      seek: this.seek,
      timeline: this.props.timeline,
      fullscreen: this.fullscreen,
      shareLink: this.props.shareLink,
      shareHeadline: this.props.shareHeadline,
      shareText: this.props.shareText,
      allowFullScreen: this.props.allowFullScreen,
      size: this.props.size
    }, this.state);

    return (
      <div>
        <VideoOverlay {...extendedProps} />
        <VideoControls ref={(ref) => this.controlRef = ref}
          {...extendedProps} />
      </div>
    );
  }

  render () {
    let {
      align, autoPlay, className, colorIndex, fit, full, loop, muted, poster,
      showControls, size
    } = this.props;
    let { ended, hasPlayed, interacting, mouseActive, playing} = this.state;
    let classes = classnames(
      CLASS_ROOT,
      {
        [`${CLASS_ROOT}--${size}`]: size,
        [`${CLASS_ROOT}--${fit}`]: fit,
        [`${CLASS_ROOT}--full`]: fit || full,
        [`${CLASS_ROOT}--interacting`]: interacting,
        [`${CLASS_ROOT}--playing`]: playing,
        [`${CLASS_ROOT}--hasPlayed`]: hasPlayed,
        [`${CLASS_ROOT}--ended`]: ended,
        [`${BACKGROUND_COLOR_INDEX}--${colorIndex}`]: colorIndex,
        [`${CLASS_ROOT}--align-top`]: align && align.top,
        [`${CLASS_ROOT}--align-bottom`]: align && align.bottom,
        [`${CLASS_ROOT}--align-left`]: align && align.left,
        [`${CLASS_ROOT}--align-right`]: align && align.right
      },
      className
    );
    const restProps = Props.omit(this.props, Object.keys(Video.propTypes));

    return (
      <div className={classes} ref={(ref) => this.containerRef = ref}
        onMouseEnter={() => {
          if (!ended) {
            this.onInterationStart();
          }
        }}
        onMouseMove={(event) => {
          // needed to avoid react synthatic event pooling
          event.persist();
          if (!ended || findDOMNode(this.controlRef).contains(event.target)) {
            this.onInterationStart();
          } else if (ended) {
            this.onInteractionOver();
          }
          clearTimeout(this.moveTimer);
          this.moveTimer = setTimeout(() => {
            const element = findDOMNode(this.controlRef);
            if (element && !element.contains(event.target)) {
              this.onInteractionOver();
            }
          }, 1000);
        }}
        onMouseLeave={this.onInteractionOver}
        onMouseDown={() => {
          this.setState({ mouseActive: true });
        }}
        onMouseUp={() => {
          this.setState({ mouseActive: false });
        }}
        onFocus={() => {
          if (mouseActive === false) {
            this.onInterationStart();
            this.setState({ focus: true });
          }
        }}
        onBlur={() => {
          this.setState({ focus: false }, () => {
            if (!this.containerRef.contains(document.activeElement)) {
              this.onInteractionOver();
            }
          });
        }}>
        <video ref={el => this.video = el} {...restProps}
          poster={poster} autoPlay={autoPlay ? 'autoplay' : false}
          loop={loop ? 'loop' : false} muted={muted} {...this.mediaEventProps}>
          {this.props.children}
        </video>
        {showControls ? this.renderControls() : undefined}
      </div>
    );
  }
}

Video.propTypes = {
  align: PropTypes.shape({
    bottom: PropTypes.boolean,
    left: PropTypes.boolean,
    right: PropTypes.boolean,
    top: PropTypes.boolean
  }),
  allowFullScreen: PropTypes.bool,
  autoPlay: PropTypes.bool,
  colorIndex: PropTypes.string,
  fit: PropTypes.oneOf(['contain', 'cover']),
  full: PropTypes.oneOf([true, 'horizontal', 'vertical', false]),
  loop: PropTypes.bool,
  muted: PropTypes.bool,
  poster: PropTypes.string,
  shareLink: PropTypes.string,
  shareHeadline: PropTypes.string,
  shareText: PropTypes.string,
  showControls: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  timeline: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    time: PropTypes.number
  })),
  title: PropTypes.node
};

Video.defaultProps = {
  allowFullScreen: true,
  autoPlay: false,
  loop: false,
  muted: false,
  size: 'medium',
  showControls: true
};