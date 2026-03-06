import type {
  Field,
  GroupField,
} from '@/modules/form-builder/form-builder.types';

import { updateFieldInTree } from '../update-field-in-tree';
import { makeGroup, makeText } from './helpers';

describe('updateFieldInTree', () => {
  it('updates the label of a root-level field', () => {
    const field = makeText({ id: 'a', label: 'Old' });
    const result = updateFieldInTree([field], 'a', { label: 'New' });
    expect(result[0].label).toBe('New');
  });

  it('updates the required flag of a text field', () => {
    const field = makeText({ id: 'a', required: false });
    const result = updateFieldInTree([field], 'a', { required: true });
    expect((result[0] as { required: boolean }).required).toBe(true);
  });

  it('updates a nested field', () => {
    const child = makeText({ id: 'child', label: 'Old' });
    const group = makeGroup({ id: 'group', children: [child] });
    const result = updateFieldInTree([group], 'child', { label: 'Updated' });
    const updatedChild = (result[0] as GroupField).children[0];
    expect(updatedChild.label).toBe('Updated');
  });

  it('is a no-op when the id is not found', () => {
    const fields: Field[] = [makeText({ id: 'a', label: 'X' })];
    const result = updateFieldInTree(fields, 'ghost', { label: 'Y' });
    expect(result[0].label).toBe('X');
  });

  it('does not mutate the original array', () => {
    const fields: Field[] = [makeText({ id: 'a', label: 'X' })];
    const snapshot = JSON.stringify(fields);
    updateFieldInTree(fields, 'a', { label: 'Y' });
    expect(JSON.stringify(fields)).toBe(snapshot);
  });

  it('updates only the targeted field among multiple siblings', () => {
    const a = makeText({ id: 'a', label: 'A' });
    const b = makeText({ id: 'b', label: 'B' });
    const c = makeText({ id: 'c', label: 'C' });
    const result = updateFieldInTree([a, b, c], 'b', { label: 'Updated' });
    expect(result[0].label).toBe('A');
    expect(result[1].label).toBe('Updated');
    expect(result[2].label).toBe('C');
  });

  it('applies multiple patch properties in one call', () => {
    const field = makeText({ id: 'a', label: 'Old', required: false });
    const result = updateFieldInTree([field], 'a', {
      label: 'New',
      required: true,
    });
    expect(result[0].label).toBe('New');
    expect((result[0] as { required: boolean }).required).toBe(true);
  });

  it('preserves pre-existing properties not included in the patch', () => {
    const field = makeText({ id: 'a', label: 'Old', required: true });
    const result = updateFieldInTree([field], 'a', { label: 'New' });
    expect(result[0].label).toBe('New');
    expect((result[0] as { required: boolean }).required).toBe(true);
  });

  it('updates a deeply nested field', () => {
    const deep = makeText({ id: 'deep', label: 'Old' });
    const inner = makeGroup({ id: 'inner', children: [deep] });
    const outer = makeGroup({ id: 'outer', children: [inner] });
    const result = updateFieldInTree([outer], 'deep', { label: 'Updated' });
    const updatedInner = (result[0] as GroupField).children[0] as GroupField;
    expect(updatedInner.children[0].label).toBe('Updated');
  });

  it('does not mutate the group containing the updated field', () => {
    const child = makeText({ id: 'child', label: 'Old' });
    const group = makeGroup({ id: 'group', children: [child] });
    const fields: Field[] = [group];
    const result = updateFieldInTree(fields, 'child', { label: 'New' });
    expect(result[0]).not.toBe(group);
    expect(group.children[0].label).toBe('Old');
  });

  it('returns non-group siblings as the same reference when recursing', () => {
    const text = makeText({ id: 'text', label: 'T' });
    const child = makeText({ id: 'child', label: 'Old' });
    const group = makeGroup({ id: 'group', children: [child] });
    const result = updateFieldInTree([text, group], 'child', { label: 'New' });
    expect(result[0]).toBe(text);
  });
});
