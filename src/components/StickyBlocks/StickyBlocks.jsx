import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RenderBlocks } from '@plone/volto/components';

const StickyBlocks = () => {
  const location = useLocation();
  const blocks = useSelector(
    (state) => state.content?.['@components']?.['sticky-blocks'],
  );

  return blocks ? <RenderBlocks content={blocks} location={location} /> : <></>;
};
export default StickyBlocks;
