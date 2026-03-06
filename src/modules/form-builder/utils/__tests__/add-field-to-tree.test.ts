import { MAX_NESTING_DEPTH } from '@/modules/form-builder/form-builder.const';
import type {
  Field,
  GroupField,
} from '@/modules/form-builder/form-builder.types';

import { addFieldToTree } from '../add-field-to-tree';
import { makeGroup, makeText } from './helpers';

describe('addFieldToTree – root insertion', () => {
  it('appends to an empty array', () => {
    const newField = makeText({ id: 'first' });
    const result = addFieldToTree([], newField, null);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(newField);
  });

  it('appends as the second field', () => {
    const first = makeText({ id: 'first' });
    const second = makeText({ id: 'second' });
    const result = addFieldToTree([first], second, null);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(first);
    expect(result[1]).toBe(second);
  });

  it('appends as the fifth field', () => {
    const existing: Field[] = [
      makeText({ id: 'f1' }),
      makeText({ id: 'f2' }),
      makeText({ id: 'f3' }),
      makeText({ id: 'f4' }),
    ];
    const fifth = makeText({ id: 'f5' });
    const result = addFieldToTree(existing, fifth, null);
    expect(result).toHaveLength(5);
    expect(result[4]).toBe(fifth);
    expect(result.slice(0, 4).map((f) => f.id)).toEqual([
      'f1',
      'f2',
      'f3',
      'f4',
    ]);
  });
});

describe('addFieldToTree – nested insertion', () => {
  it('adds a field as the first child of an empty group', () => {
    const group = makeGroup({ id: 'group-1' });
    const newField = makeText({ id: 'new-text' });
    const result = addFieldToTree([group], newField, 'group-1');
    const updatedGroup = result[0] as GroupField;
    expect(updatedGroup.children).toHaveLength(1);
    expect(updatedGroup.children[0]).toBe(newField);
  });

  it('appends a field after existing children in a non-empty group', () => {
    const existing = makeText({ id: 'existing' });
    const group = makeGroup({ id: 'group-1', children: [existing] });
    const newField = makeText({ id: 'new-text' });
    const result = addFieldToTree([group], newField, 'group-1');
    const updatedGroup = result[0] as GroupField;
    expect(updatedGroup.children).toHaveLength(2);
    expect(updatedGroup.children[0]).toBe(existing);
    expect(updatedGroup.children[1]).toBe(newField);
  });

  it('does not modify non-matching groups', () => {
    const group1 = makeGroup({ id: 'group-1' });
    const group2 = makeGroup({ id: 'group-2' });
    const newField = makeText({ id: 'new-text' });
    const result = addFieldToTree([group1, group2], newField, 'group-2');
    expect((result[0] as GroupField).children).toHaveLength(0);
    expect((result[1] as GroupField).children).toHaveLength(1);
  });

  it('adds to the last of three sibling groups', () => {
    const first = makeGroup({ id: 'first' });
    const second = makeGroup({ id: 'second' });
    const third = makeGroup({ id: 'third' });
    const outer = makeGroup({ id: 'outer', children: [first, second, third] });
    const newField = makeText({ id: 'new' });
    const result = addFieldToTree([outer], newField, 'third');
    const children = (result[0] as GroupField).children;
    expect((children[0] as GroupField).children).toHaveLength(0);
    expect((children[1] as GroupField).children).toHaveLength(0);
    expect((children[2] as GroupField).children).toHaveLength(1);
    expect((children[2] as GroupField).children[0]).toBe(newField);
  });

  it('adds to a second-level group that has a sibling', () => {
    const sibling = makeText({ id: 'sibling' });
    const target = makeGroup({ id: 'target' });
    const middle = makeGroup({ id: 'middle', children: [target, sibling] });
    const outer = makeGroup({ id: 'outer', children: [middle] });
    const newField = makeText({ id: 'new' });
    const result = addFieldToTree([outer], newField, 'target');
    const middleResult = (result[0] as GroupField).children[0] as GroupField;
    const targetResult = middleResult.children[0] as GroupField;
    expect(targetResult.children).toHaveLength(1);
    expect(targetResult.children[0]).toBe(newField);
    expect(middleResult.children[1].id).toBe('sibling');
  });

  it('adds to a second-level group that has no siblings', () => {
    const target = makeGroup({ id: 'target' });
    const middle = makeGroup({ id: 'middle', children: [target] });
    const outer = makeGroup({ id: 'outer', children: [middle] });
    const newField = makeText({ id: 'new' });
    const result = addFieldToTree([outer], newField, 'target');
    const middleResult = (result[0] as GroupField).children[0] as GroupField;
    expect(middleResult.children).toHaveLength(1);
    const targetResult = middleResult.children[0] as GroupField;
    expect(targetResult.children).toHaveLength(1);
    expect(targetResult.children[0]).toBe(newField);
  });

  it('returns the tree unchanged when parentId does not match any field', () => {
    const fields: Field[] = [makeText()];
    const result = addFieldToTree(fields, makeText(), 'no-such-id');
    expect(result).toEqual(fields);
  });

  it('returns the tree unchanged when parentId targets a non-group field', () => {
    const text = makeText({ id: 'text' });
    const newField = makeText({ id: 'new' });
    const result = addFieldToTree([text], newField, 'text');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('text');
  });

  it('returns the tree unchanged when parentId is an empty string', () => {
    const fields: Field[] = [makeText({ id: 'a' })];
    const result = addFieldToTree(fields, makeText({ id: 'new' }), '');
    expect(result).toEqual(fields);
  });

  it('adds a group as a child of another group', () => {
    const parent = makeGroup({ id: 'parent' });
    const childGroup = makeGroup({ id: 'child-group' });
    const result = addFieldToTree([parent], childGroup, 'parent');
    const updatedParent = result[0] as GroupField;
    expect(updatedParent.children).toHaveLength(1);
    expect(updatedParent.children[0]).toBe(childGroup);
  });
});

describe('addFieldToTree – depth enforcement', () => {
  /** Build a chain of MAX_NESTING_DEPTH - 1 nested groups (deepest is at depth MAX-1) */
  const buildMaxDepthChain = (): { fields: Field[]; deepestId: string } => {
    const deepestId = 'deepest';
    let node: GroupField = makeGroup({ id: deepestId, children: [] });
    for (let i = MAX_NESTING_DEPTH - 2; i >= 0; i--) {
      node = makeGroup({ id: `g-${i}`, children: [node] });
    }
    return { fields: [node], deepestId };
  };

  it('allows adding a child to a group one level below the maximum depth', () => {
    // Build a chain of MAX_NESTING_DEPTH - 2 groups so the deepest is at depth MAX-2,
    // meaning its children would be at MAX-1 – still within the limit.
    const deepestId = 'deepest';
    let node: GroupField = makeGroup({ id: deepestId, children: [] });
    for (let i = MAX_NESTING_DEPTH - 3; i >= 0; i--) {
      node = makeGroup({ id: `g-${i}`, children: [node] });
    }
    const newField = makeText({ id: 'new' });
    const result = addFieldToTree([node], newField, deepestId);
    const findDeepest = (arr: Field[]): GroupField | null => {
      for (const f of arr) {
        if (f.id === deepestId) return f as GroupField;
        if (f.type === 'group') {
          const found = findDeepest(f.children);
          if (found) return found;
        }
      }
      return null;
    };
    expect(findDeepest(result)?.children).toHaveLength(1);
  });

  it('refuses to add a child to a group at the maximum nesting depth', () => {
    const { fields, deepestId } = buildMaxDepthChain();
    const newField = makeText();
    const result = addFieldToTree(fields, newField, deepestId);
    // The deeply nested group should remain empty – insertion was refused
    const findDeepest = (arr: Field[]): GroupField | null => {
      for (const f of arr) {
        if (f.id === deepestId) return f as GroupField;
        if (f.type === 'group') {
          const found = findDeepest(f.children);
          if (found) return found;
        }
      }
      return null;
    };
    expect(findDeepest(result)?.children).toHaveLength(0);
  });
});
