import React, { useState, memo } from 'react';
import { FixedSizeList as List, areEqual } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import memoizeOne from 'memoize-one';

const Row = memo(({ data, index, style }) => {
  const { flattenedData, onOpen, onSelect } = data;
  const node = flattenedData[index];
  const left = node.depth * 20;
  return (
    <div className="item-background" style={style} onClick={() => onOpen(node)}>
      <div
        className={`${node.hasChildren ? 'tree-branch' : ''} ${node.collapsed ? 'tree-item-closed' : 'tree-item-open'}`}
        onClick={e => onSelect(e, node)}
        style={{
          position: 'absolute',
          left: `${left}px`,
          width: `calc(100% - ${left}px)`,
        }}
      >
        {`${node.label}`}
      </div>
    </div>
  );
}, areEqual);

const getItemData = memoizeOne((onOpen, onSelect, flattenedData) => ({
  onOpen,
  onSelect,
  flattenedData,
}));

const SpeedTree = ({ data }) => {
  const [openedNodeIds, setOpenedNodeIds] = useState([]);

  const flattenOpened = treeData => {
    const result = [];
    for (let node of data) {
      flattenNode(node, 1, result);
    }
    return result;
  };

  const flattenNode = (node, depth, result) => {
    const { id, label, children } = node;
    let collapsed = !openedNodeIds.includes(id);
    result.push({
      id,
      label,
      hasChildren: children && children.length > 0,
      depth,
      collapsed,
    });

    if (!collapsed && children) {
      for (let child of children) {
        flattenNode(child, depth + 1, result);
      }
    }
  };

  const onOpen = node => (node.collapsed ? setOpenedNodeIds([...openedNodeIds, node.id]) : setOpenedNodeIds(openedNodeIds.filter(id => id !== node.id)));

  const onSelect = (e, node) => {
    //e.stopPropagation();
  };

  const flattenedData = flattenOpened(data);

  const itemData = getItemData(onOpen, onSelect, flattenedData);

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List className="List" height={height} itemCount={flattenedData.length} itemSize={32} width={width} itemKey={index => flattenedData[index].id} itemData={itemData}>
          {Row}
        </List>
      )}
    </AutoSizer>
  );
};

export default SpeedTree;
