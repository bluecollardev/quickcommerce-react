import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Box from '../Box';
import CSSClassnames from '../../../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.VIDEO;

export default class ProgressBar extends Component {

  constructor () {
    super();

    this.onProgressBarChange = this.onProgressBarChange.bind(this);
  }

  // prevents unnecessarily updates/re-renders
  shouldComponentUpdate (nextProps) {
    return this.props.progress !== nextProps.progress;
  }

  onProgressBarChange (e) {
    this.props.onChange(e.target.value * this.props.duration / 100);
  }

  onChapterClick (time) {
    this.props.onChange(time);
  }

  _onMouseOver (index) {
    this.props.onChapterHover(index);
  }

  _renderChapterMarkers () {
    const { duration, timeline } = this.props;

    if (timeline) {
      let chapters = timeline.map((chapter, index, chapters) => {
        let percent = (chapter.time / duration) * 100;
        let tickClasses = classnames(
          `${CLASS_ROOT}__chapter-marker-tick`,
          {
            [`${CLASS_ROOT}__chapter-marker-tick-start`]: percent === 0
          }
        );

        return (
          <div className={`${CLASS_ROOT}__chapter-marker`} key={chapter.time}
            style={{width: `${percent}%`}}>
            <div className={tickClasses}
              onMouseOver={this.onMouseOver.bind(this, index)}
              onMouseOut={this.props.onChapterHover}
              onFocus={this.onMouseOver.bind(this, index)}
              onBlur={this.props.onChapterHover}
              onClick={this.onChapterClick.bind(this, chapter.time)} />
            <div className={`${CLASS_ROOT}__chapter-marker-track`} />
          </div>
        );
      });

      return (
        <div className={`${CLASS_ROOT}__chapter-markers`}>
          {chapters}
        </div>
      );
    }
  }

  render () {
    const { progress, timeline } = this.props;

    return (
      <Box pad="none" className={`${CLASS_ROOT}__progress`} direction="row">
        <div className={`${CLASS_ROOT}__progress-bar-fill`} style={{
          width: progress + '%'
        }} />
        {timeline ? this.renderChapterMarkers() : undefined}
        <input className={`${CLASS_ROOT}__progress-bar-input`}
          onChange={this.onProgressBarChange}
          type="range"
          min="0"
          max="100"
          value={progress || ''}
          step="0.1" />
      </Box>
    );
  }
}

ProgressBar.propTypes = {
  onClick: PropTypes.func,
  duration: PropTypes.number,
  progress: PropTypes.number,
  onChapterHover: PropTypes.func
};

ProgressBar.defaultProps = {
  duration: 0,
  progress: 0
};
