import { writable } from 'svelte/store';

import Home from "./../Pages/Home.svelte";
import Projects from "./../Pages/Projects.svelte";
import NotFound from "./../Pages/NotFound.svelte";
import LangTester from "./../Pages/LangTester.svelte";
import PageViewerExample from "./../Pages/PageViewerExample.svelte";
import { location, push } from "svelte-spa-router";

export let locationService = writable("/");
location.subscribe((l) => {
  locationService.set(l);
});

const routes = {
  "/": Home,
  "/home": Home,
  "/projects": Projects,
  "/lang-tester": LangTester,
  "/page-viewer": PageViewerExample,
  "*": NotFound
};

const navigateTo = param => {
  push(param);
};

export { routes, navigateTo };
