import React, { useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Form as UIForm, Grid } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
import { Form, Sidebar } from '@plone/volto/components';
import { Portal } from 'react-portal';
import { v4 as uuid } from 'uuid';
import config from '@plone/volto/registry';

const messages = defineMessages({
  blocks: {
    id: 'stickyblocks-blocks',
    defaultMessage: 'Blocchi',
  },
});

const StickyBlocksConfigurationForm = ({ id, item, onChange }) => {
  const defaultBlockId = uuid();
  const intl = useIntl();

  if (!item.blocks_layout || isEmpty(item.blocks_layout.items)) {
    item.blocks_layout = {
      items: [defaultBlockId],
    };
  }
  if (!item.blocks || isEmpty(item.blocks)) {
    item.blocks = {
      [defaultBlockId]: {
        '@type': config.settings.defaultBlockType,
      },
    };
  }

  const preventClick = (e) => {
    e.preventDefault();
  };

  const preventEnter = (e) => {
    if (e.code === 'Enter') {
      preventClick(e);
    }
  };

  useEffect(() => {
    document
      .querySelector('form.ui.form')
      .addEventListener('click', preventClick);

    document.querySelectorAll('form.ui.form input').forEach((item) => {
      item.addEventListener('keypress', preventEnter);
    });

    return () => {
      document
        .querySelector('form.ui.form')
        ?.removeEventListener('click', preventClick);
      document.querySelectorAll('form.ui.form input')?.forEach((item) => {
        item?.removeEventListener('keypress', preventEnter);
      });
    };
  }, []);

  const onChangeFormBlocks = (data) => {
    onChange({
      ...item,
      blocks: data.blocks,
      blocks_layout: data.blocks_layout,
    });
  };
  return (
    <>
      <UIForm.Field inline className="wide" id="menu-blocks">
        <Grid>
          <Grid.Row stretched>
            <Grid.Column width={12}>
              <div className="wrapper">
                <label>{intl.formatMessage(messages.blocks)}</label>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row stretched>
            <Grid.Column width={12}>
              <div className="menu-blocks-container">
                <Form
                  key={id}
                  formData={item}
                  visual={true}
                  hideActions
                  onChangeFormData={onChangeFormBlocks}
                />
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </UIForm.Field>
      <Portal node={document.getElementById('sidebar')}>
        <Sidebar />
      </Portal>
    </>
  );
};

export default React.memo(StickyBlocksConfigurationForm);
