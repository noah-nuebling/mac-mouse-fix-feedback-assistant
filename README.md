# Mac Mouse Fix Feedback Assistant

Tool for creating great feedback for the Mac Mouse Fix project.

Based on [Vue Issue Helper](https://github.com/vuejs/vue-issue-helper).

--- 

To test run 'yarn run serve' \
To deploy run 'yarn run deploy'

---

Currently experiencing this issue where `./node_modules/.bin/vue-cli-service build` builds successfully but then just 
gets stuck. This makes `yarn run deploy` unusable. You can still deploy by doing the steps in `deploy.sh` manually,
and just force quitting `yarn run build` when it gets stuck. (`yarn run build` is just a proxy for 
`./node_modules/.bin/vue-cli-service build` as far as I understand.)