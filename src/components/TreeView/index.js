import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import { getCategories, setCategory } from 'src/slices/category';

// const data = {
//   id: 'root',
//   name: 'Parent',
//   children: [
//     {
//       id: '1',
//       name: 'Child - 1'
//     },
//     {
//       id: '3',
//       name: 'Child - 3',
//       children: [
//         {
//           id: '4',
//           name: 'Child - 4'
//         }
//       ]
//     }
//   ]
// };
const data = {
  _id: 'root',
  name: 'Root',
  children: []
};

export default function CategoryTree() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.items);
  console.log('----------categories', categories);

  const setCurrentNode = (node) => {
    console.log('---selected node', node);
    if (node._id === 'root')
      dispatch(
        setCategory({
          _id: undefined,
          parent: 'Root',
          name: '',
          description: '',
          children: [],
          child: {
            parent: 'Root',
            name: '',
            description: ''
          }
        })
      );
    else
      dispatch(
        setCategory({
          ...node,
          child: { parent: node.name, name: '', description: '' }
        })
      );
  };

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes._id}
      label={nodes.name}
      onClick={() => setCurrentNode(nodes)}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  return (
    <TreeView
      aria-label="rich object"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      {renderTree({ ...data, children: categories })}
    </TreeView>
  );
}
