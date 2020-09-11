import Home from "./../Pages/Home.svelte";
import Projects from "./../Pages/Projects.svelte";
import NotFound from "./../Pages/NotFound.svelte";
import LangTester from "./../Pages/LangTester.svelte";
import { push } from "svelte-spa-router";

const routes = {
  "/": Home,
  "/home": Home,
  "/projects": Projects,
  "/lang-tester": LangTester,
  "*": NotFound
};

const navigateTo = param => {
  push(param);
};

export { routes, navigateTo };
