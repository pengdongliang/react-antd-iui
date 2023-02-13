module.exports = {
  staticDirs: ["../src/stories/assets"],
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
        transcludeMarkdown: true,
      },
    },
  ],
  framework: '@storybook/react',
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      // propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
    },
  },
}
