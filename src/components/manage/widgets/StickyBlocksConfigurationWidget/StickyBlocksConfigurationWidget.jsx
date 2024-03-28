import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { defineMessages, useIntl } from 'react-intl';
import { Icon, Grid, Menu, Form, Button, Segment } from 'semantic-ui-react';
import { TextWidget, Component } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import { Error } from '@plone/volto/components';
import './stickyblocks_configuration.css';

const messages = defineMessages({
  addPath: {
    id: 'stickyblocks-add-rootpath',
    defaultMessage: 'Add path',
  },
  deleteButton: {
    id: 'stickyblocks-delete-button',
    defaultMessage: 'Delete',
  },
  root_path: {
    id: 'stickyblocks-rootpath',
    defaultMessage: 'Root path',
  },
  emptyActivePath: {
    id: 'stickyblocks-emptyActivePath',
    defaultMessage: 'Select a path',
  },
});

const defaultItem = (title) => ({
  title,
  visible: true,
  linkUrl: null,
});

const defaultRootConfig = (title) => ({
  rootPath: '/',
  items: [defaultItem(title)],
});

const defaultConfiguration = [defaultRootConfig];

const StickyBlocksConfigurationWidget = ({
  value,
  id,
  onChange,
  required,
  title,
  description,
}) => {
  const intl = useIntl();
  const isLoggedIn = useSelector((state) => state.userSession.token);

  const [configuration, setConfiguration] = useState(
    value ? JSON.parse(value) : defaultConfiguration,
  );
  const [activeConfigPath, setActiveConfigPath] = useState(0);

  if (!isLoggedIn) {
    return <Error error={{ status: 401, message: 'Unauthorized' }} />;
  }

  const handleChangeConfiguration = (value) => {
    setConfiguration(value);
    onChange(id, JSON.stringify(value));
  };

  const addPath = (e) => {
    e.preventDefault();
    const itemsNumber = configuration.length;
    const item = `/tab${itemsNumber}`;
    let newConfiguration = [
      ...configuration,
      {
        ...defaultRootConfig(`Tab ${itemsNumber}`),
        rootPath: item,
      },
    ];

    handleChangeConfiguration(newConfiguration);
    setActiveConfigPath(newConfiguration.length - 1);
  };

  const deleteMenuPath = (e, index) => {
    e.preventDefault();
    let newConfiguration = [...configuration];
    newConfiguration.splice(index, 1);

    if (activeConfigPath === index) {
      setTimeout(() => setActiveConfigPath(index > 0 ? index - 1 : 0), 0);
    }

    handleChangeConfiguration(newConfiguration);
  };

  const onChangeConfiguration = (index, config) => {
    let newConfiguration = [...configuration];
    newConfiguration[index] = config;

    handleChangeConfiguration(newConfiguration);
  };

  return (
    <div className="stickyblocks-configuration-widget">
      <Form.Field inline id={id}>
        <Grid>
          <Grid.Row>
            <Grid.Column width="12">
              <div className="wrapper">
                <label htmlFor="stickyblocks-configuration">{title}</label>
              </div>
            </Grid.Column>
            <Grid.Column
              width="12"
              className="stickyblocks-configuration-widget"
            >
              <div id="stickyblocks-configuration">
                <Menu pointing secondary className="path-menu">
                  {configuration.map((pathConfig, idx) => (
                    <Menu.Item
                      key={`path-${idx}`}
                      name={pathConfig.rootPath}
                      active={activeConfigPath === idx}
                      onClick={() => {
                        setActiveConfigPath(idx);
                      }}
                    >
                      <span>{flattenToAppURL(pathConfig.rootPath)}</span>
                    </Menu.Item>
                  ))}
                  <Menu.Item
                    active={false}
                    name={intl.formatMessage(messages.addPath)}
                    onClick={addPath}
                  >
                    <Icon name="plus" />
                  </Menu.Item>
                </Menu>
                <Segment>
                  {activeConfigPath > -1 &&
                  activeConfigPath < configuration.length ? (
                    <Grid>
                      <Grid.Column
                        width={12}
                        className="stickyblocks-rootpath-segment"
                      >
                        <TextWidget
                          id="rootPath"
                          title={intl.formatMessage(messages.root_path)}
                          description=""
                          required={true}
                          value={flattenToAppURL(
                            configuration[activeConfigPath].rootPath,
                          )}
                          onChange={(id, value) => {
                            onChangeConfiguration(activeConfigPath, {
                              ...configuration[activeConfigPath],
                              rootPath: value?.length ? value : '/',
                            });
                          }}
                        />
                        <Form.Field
                          inline
                          className="delete wide"
                          id="path-delete"
                        >
                          <Grid>
                            <Grid.Row stretched>
                              <Grid.Column width={12}>
                                <Button
                                  icon="trash"
                                  negative
                                  onClick={(e) =>
                                    deleteMenuPath(e, activeConfigPath)
                                  }
                                  id="delete-path"
                                  content={intl.formatMessage(
                                    messages.deleteButton,
                                  )}
                                />
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                        </Form.Field>
                      </Grid.Column>
                      <Grid.Column width={12}>
                        <Component
                          componentName="StickyBlocksConfigurationForm"
                          id={`${activeConfigPath}-blocks`}
                          item={configuration[activeConfigPath]}
                          onChange={(config) =>
                            onChangeConfiguration(activeConfigPath, config)
                          }
                        />
                      </Grid.Column>
                    </Grid>
                  ) : (
                    <span>{intl.formatMessage(messages.emptyActivePath)}</span>
                  )}
                </Segment>
              </div>
            </Grid.Column>
          </Grid.Row>
          {description && (
            <Grid.Row stretched>
              <Grid.Column stretched width="12">
                <p className="help">{description}</p>
              </Grid.Column>
            </Grid.Row>
          )}
        </Grid>
      </Form.Field>
    </div>
  );
};

export default StickyBlocksConfigurationWidget;
