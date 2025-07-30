# Mac Mouse Fix Feedback Assistant

Tool for creating great feedback for the Mac Mouse Fix project.

Based on [Vue Issue Helper](https://github.com/vuejs/vue-issue-helper).
  
--- 

Update: [Mar 2025] to run any of this stuff activate old node version:
- Install nvm (node version manager) 
    (Update: [Jul 2025] It doesn't work in fish shell I think – use bash)
- Run `nvm use 16`
    (Update: [Jul 2025] If `node` gives you 'bad CPU type' errors, you might have to `sudo rm -rf ~/.nvm/versions/node/<node_version>`  and then reinstall – I think that happens when switching between Intel and Apple Silicon Mac)
- Now `yarn install` should work. 
    (Update: [Jul 2025] But only if we have the old yarn.lock file! If we do it from scratch, the install fails. Webdev is crazyyy.)
- (Reasoning: Some packages dependencies require node 17 or before. Claude told us to use node 16 since it has LTS (long-term-support))
    (Update: [Jul 2025] `./.nvmrc` has v8.11.1 – should we use that?)

#

To install dependencies run `yarn install`

To test run `yarn run serve` \
To deploy run `yarn run deploy`

---

**Notes**

Currently experiencing this issue where `./node_modules/.bin/vue-cli-service build` builds successfully but then just 
gets stuck. This makes `yarn run deploy` unusable. You can still deploy by doing the steps in `deploy.sh` manually,
and just force quitting `yarn run build` when it gets stuck. (`yarn run build` is just a proxy for 
`./node_modules/.bin/vue-cli-service build` as far as I understand.)

---

**Issues**

In Chrome, single-line text fields are like 1.5 lines high when they don't have content.
