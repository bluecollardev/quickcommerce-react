import React, { Component } from 'react';
import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';

import Card from 'grommet/components/Card';
import Chart, { Area, Axis, Base, Layers } from 'grommet/components/chart/Chart';

import Menu from 'grommet/components/Menu';
import Footer from 'grommet/components/Footer';
import FormField from 'grommet/components/FormField';
import NumberInput from 'grommet/components/NumberInput';
import Select from 'grommet/components/Select';
import Heading from 'grommet/components/Heading';
import Hero from 'grommet/components/Hero';
import Image from 'grommet/components/Image';
import Label from 'grommet/components/Label';


import TableHeader from 'grommet/components/TableHeader';
import TableRow from 'grommet/components/TableRow';
import Paragraph from 'grommet/components/Paragraph';
import Quote from 'grommet/components/Quote';
import Section from 'grommet/components/Section';
import SocialShare from 'grommet/components/SocialShare';
import Video from 'grommet/components/Video';
import CirclePlayIcon from 'grommet/components/icons/base/CirclePlay';
//import Header from './Header';

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap';
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { Button, Checkbox, Radio, } from 'react-bootstrap';

export default class ContentArticle extends Component {
  render() {
    return (
      <Box>
        <Hero style={{display: 'none'}} size="large" backgroundImage="/img/marquee.jpg" colorIndex="grey-1"
          justify="start">
          <Card
            heading={
              <Heading strong={true}>
                Lorem ipsum dolor sit amet consectetur elit.
              </Heading>
            }
            description="Pellentesque porta ut augue ac ultricies. Sed vehicula metus 
              a vulputate egestas." 
            label="Challenge" 
            size="large"
            link={
              <Anchor href="#" primary={true} label="Learn More" />
            } />
        </Hero>
        <Section pad="none" align="center">
          <Box
            direction="row"
            size={{width: 'full'}}
            pad={{horizontal: 'large'}}>
            <Paragraph margin="small">
              The finest italian espresso coffee
            </Paragraph>
          </Box>
        </Section>
        <Section pad="none" align="center">
          <Box
            direction="row"
            justify="center"
            size={{width: 'full'}}
            pad={{horizontal: 'large', vertical: 'medium', between: 'large'}}>
            <Box basis="2/3">
                <Image src="/img/case_study.png" alt="" />
                <Section pad="none" align="center">
                    <Box full="horizontal">
                        <Image style={{ maxHeight: '25rem' }} full src="/img/section-1.jpg" />
                        </Box>
                        <Box
                        direction="row"
                        size={{width: 'full'}}
                        pad={{horizontal: 'large'}}
                        >
                    </Box>
                </Section>
            </Box>
            <Box basis="1/3">
              <Image src="/img/case_study.png" alt="example image" />
              <Box margin={{top: 'medium'}}>
                <Label size="small" uppercase>Summary</Label>
                <Paragraph size="large" margin="none">
                  <strong>Short Title Blurb</strong>
                </Paragraph>
                <Paragraph margin="medium">
                  Lorem delectus accusantium alias voluptate explicabo? Quaerat
                  eius veniam corrupti laboriosam odio, consectetur, autem
                  aspernatur enim nulla. Animi dolorem ipsum nobis quibusdam
                  possimus quae non quis reprehenderit iusto. Esse mollitia
                  mollitia molestiae illum aspernatur velit odit odit? Consectetur
                  blanditiis omnis.
                </Paragraph>
              </Box>
            </Box>
          </Box>
        </Section>

        <Section pad="none" align="stretch">        
          <Box
            direction="row"
            justify="stretch"
            size={{width: 'full'}}>
            <Heading style={{ marginTop: '1.5rem' }} strong>Ipsum lorem article</Heading>
          </Box>
          
          <Box
            direction="row"
            justify="stretch"
            size={{width: 'full'}}>
            
            <Box basis="2/3">
                <Paragraph size="large" margin="small">
                    Casi Cielo, Spanish for “almost heaven,” comes from the lush Antigua region of Guatemala—a coffee-growing paradise. 
                    The volcanic soil of this fertile valley creates this elegant, complex coffee with subtle floral aromas, an alluring 
                    brightness and a smooth cocoa finish. This exquisite single-origin coffee is an annual celebration of everything we love about Antigua.
                </Paragraph>
            </Box>
            
            <Box basis="1/3">
              <Image src="/img/case_study.png" alt="example image" />
              <Box margin={{top: 'medium'}}>
                <Label size="small" uppercase>The Author</Label>
                <Paragraph size="large" margin="none">
                  <strong>Kirk Bresniker</strong>
                </Paragraph>
                <Paragraph margin="medium">
                  Lorem delectus accusantium alias voluptate explicabo? Quaerat
                  eius veniam corrupti laboriosam odio, consectetur, autem
                  aspernatur enim nulla. Animi dolorem ipsum nobis quibusdam
                  possimus quae non quis reprehenderit iusto. Esse mollitia
                  mollitia molestiae illum aspernatur velit odit odit? Consectetur
                  blanditiis omnis.
                </Paragraph>
              </Box>
              <Box
                direction="row"
                justify="between"
                separator="top"
              >
                <Label margin="small" size="small" uppercase={true}>
                  <strong>Share</strong>
                </Label>
                <Box
                  align="center"
                  direction="row"
                  responsive={false}
                >
                  <SocialShare
                    type="email"
                    link="http://www.grommet.io/docs/"
                    colorIndex="grey-4"
                  />
                  <SocialShare
                    type="twitter"
                    link="http://www.grommet.io/docs/"
                    colorIndex="grey-4"
                  />
                  <SocialShare
                    type="facebook"
                    link="http://www.grommet.io/docs/"
                    colorIndex="grey-4"
                  />
                  <SocialShare
                    type="linkedin"
                    link="http://www.grommet.io/docs/"
                    colorIndex="grey-4"
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Section>
      </Box>
    );
  }
};