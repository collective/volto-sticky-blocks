import StickyBlocksConfigurationWidget from './components/manage/widgets/StickyBlocksConfigurationWidget/StickyBlocksConfigurationWidget';
import StickyBlocksConfigurationForm from './components/manage/widgets/StickyBlocksConfigurationWidget/StickyBlocksConfigurationForm';
import StickyBlocks from './components/StickyBlocks/StickyBlocks';

export {
  StickyBlocksConfigurationWidget,
  StickyBlocksConfigurationForm,
  StickyBlocks
};

export default (config) => {
  config.registerComponent({
    name: 'StickyBlocksConfigurationForm',
    component: StickyBlocksConfigurationForm,
  });

  config.widgets.id = {
    ...config.widgets.id,
    sticky_blocks_configuration: StickyBlocksConfigurationWidget,
  };

  config.settings.apiExpanders.push({
    match: '/',
    GET_CONTENT: ['sticky-blocks'],
  });

  return config;
};
