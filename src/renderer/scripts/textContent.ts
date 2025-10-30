import data from '@/greeting.txt?raw';

export const fullBuiltinContents: { [key: string]: string[] } = {};

data
  .replace(/\r\n/g, '\n')
  .split('\n\n')
  .map((item) => item.split('\n').filter(Boolean))
  .forEach((item) => {
    fullBuiltinContents[item[0]?.replace(/^:/g, '') || 'default'] = item.slice(1);
  });

export const AllBuiltinGroups = Object.keys(fullBuiltinContents);

export function computedTextContent(enableGroups: Ref<string[]>) {
  return computed(() => {
    return enableGroups.value.map((item) => fullBuiltinContents[item] || []).flat();
  });
}
