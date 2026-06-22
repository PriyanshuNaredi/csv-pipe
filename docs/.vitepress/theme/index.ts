import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client';
import '@shikijs/vitepress-twoslash/style.css';
import type { EnhanceAppContext } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './custom.css';
import Playground from './Playground.vue';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoslashFloatingVue);
    app.component('Playground', Playground);
  }
};
