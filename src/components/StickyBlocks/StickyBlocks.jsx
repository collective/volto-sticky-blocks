import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RenderBlocks } from '@plone/volto/components';

const DefaultContainer = ({ children, className }) => (
  <div className={className}>{children}</div>
);

const StickyBlocks = ({ container = DefaultContainer }) => {
  const location = useLocation();
  const blocks = useSelector(
    (state) => state.content?.data?.['@components']?.['sticky-blocks'],
  );

  const ContainerComponent = container;
  return blocks ? (
    <ContainerComponent className="sticky-blocks">
      <RenderBlocks content={blocks} location={location} />
    </ContainerComponent>
  ) : (
    <></>
  );
};
export default StickyBlocks;
