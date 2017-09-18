// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import Anchor from 'grommet/components/Anchor';
import DocsArticle from '../../components/DocsArticle';

export default class Integration extends Component {

  render () {
    return (
      <DocsArticle title='Integration'>
        <section>
          <p>
            {"Grommet's"} modular design enables you to use the parts of Grommet
            applicable to your application.  There are several ways you can
            benefit from using Grommet based on the needs of your users and
            your application.  The options range from referencing the style
            guide and its basic elements to complete adoption of the platform.
          </p>

          <h2>Style Guide</h2>
          <p>
            Your team references the <Anchor path="/docs/resources">
            Grommet style guide</Anchor> with
            an emphasis on brand alignment - primarily around the logo, font,
            and color palette.  If your application is not in a position to
            begin adopting a new platform, this option may be the most
            appropriate option.
            You may find the <a
            href={"https://github.com/grommet/grommet/tree/master/" +
              "src/scss/grommet-core"} target='_blank'>Grommet CSS</a> elements
            a useful reference.
          </p>

          <h2>Style Sheets</h2>
          <p>
            Your application uses
            the <a href={"https://github.com/grommet/grommet/tree/master/" +
              "src/scss/grommet-core"} target='_blank'>Grommet CSS</a> elements
            to ensure styling of components is aligned.  
            Your {"application's"} DOM structure will likely need to 
            change to align with the DOM structure expected by the Grommet CSS.
          </p>

          <h2>Components</h2>
          <p>
            Your application leverages the <Anchor path='/docs/components'>
            Grommet components</Anchor> with
            the accompanying markup, styling, and images.
            This model is appropriate in several situations:
          </p>
          <ul>
            <li>
              Your application is new or is being refactored to use
              the Grommet components.
            </li>
            <li>
              Your application uses AngularJS and you want to use Grommet
              components for the "view" in your MVC architecture.
            </li>
            <li>
              Your application is being updated to use Grommet components
              in replacing portions of the user interface based on legacy
              technologies such as Adobe Flex or Java Applets.
            </li>
          </ul>
          <h2>Application</h2>
          <p>
            Your application is new or is being rewritten to use the Grommet
            components and a set of common services for features as search,
            associations, and dashboards.
          </p>
        </section>
      </DocsArticle>
    );
  }
};
