// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import NumberInput from 'grommet/components/NumberInput';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import DocsArticle from '../../components/DocsArticle';
import Code from '../../components/Code';

export default class NumberInputDoc extends Component {

  constructor () {
    super();
    this._onChange = this._onChange.bind(this);
    this.state = { value: 10 };
  }

  _onChange (event) {
    this.setState({value: event.target.value});
  }

  render () {
    return (
      <DocsArticle title='NumberInput'>

        <section>
          <p>A number input in a web form. We have a separate component from the
            browser base so we can style it.</p>
          <Form>
            <FormField>
              <NumberInput id='item1' name='item1' label='Item 1'
                value={this.state.value} onChange={this._onChange} />
            </FormField>
          </Form>
        </section>

        <section>
          <h2>Properties</h2>
          <dl>
            <dt><code>defaultValue  {'{number}'}</code></dt>
            <dd>Same as React {'<input defaultValue= >'}.</dd>
            <dt><code>disabled        true|false</code></dt>
            <dd>Same as React {'<input disabled= >'}.
              Also adds a hidden input element with the same name so
              form submissions work.</dd>
            <dt><code>id              {'{string}'}</code></dt>
            <dd>The DOM id attribute value to use for the underlying
              {'<input>'} element.</dd>
            <dt><code>max             {'{number}'}</code></dt>
            <dd>Maximum value.</dd>
            <dt><code>min             {'{number}'}</code></dt>
            <dd>Minimum value.</dd>
            <dt><code>name            {'{string}'}</code></dt>
            <dd>The DOM name attribute value to use for the underlying
              {'<input>'} element.</dd>
            <dt><code>onChange        {'{function}'}</code></dt>
            <dd>Same as React {'<input onChange= >'}.</dd>
            <dt><code>step            {'{number}'}</code></dt>
            <dd>Steps to increase and decrease by.</dd>
            <dt><code>value           {'{number}'}</code></dt>
            <dd>The value to put in the input.</dd>
          </dl>
        </section>

        <section>
          <h2>Usage</h2>
          <Code preamble={
            `import NumberInput from 'grommet/components/NumberInput';`}>
            <NumberInput value={this.state.value} onChange={() => {}} />
          </Code>
        </section>

      </DocsArticle>
    );
  }
};
