/**
 * @file reducers/content.js
 * @author H.Alper Tuna <halpertuna@gmail.com>
 * Date: 16.12.2016
 */

import { changeSubMenuVisibility } from '../actions/content';
import flattenContent from './flattenContent';

const item = (state, action) => {
  switch (action.type) {
    case 'CHANGE_SUBMENU_VISIBILITY': {
      return Object.assign({}, state, {
        subMenuVisibility: state.id === action.id
          ? action.subMenuVisibility
          : action.trace.indexOf(state.id) !== -1,
      });
    }
    case 'CHANGE_ACTIVE_LINK_FROM_LOCATION':
    case 'CHANGE_ACTIVE_LINK': {
      return Object.assign({}, state, {
        active: state.id === action.id,
        hasActiveChild: action.trace.indexOf(state.id) !== -1,
      });
    }
    default: {
      return state;
    }
  }
};

const findItem = (content, value, prop) => content.find(i => i[prop] === value);

const content = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_CONTENT': {
      return flattenContent(action.content);
    }
    case 'CHANGE_SUBMENU_VISIBILITY': {
      return state.map(i => item(i, action));
    }
    case 'CHANGE_ACTIVE_LINK_FROM_LOCATION':
    case 'CHANGE_ACTIVE_LINK': {
      let activeItem;
      if (action.type === 'CHANGE_ACTIVE_LINK_FROM_LOCATION') {
        const locationSets = [
          window.location.pathname + window.location.search, // /path?search
          window.location.hash, // #hash
          window.location.pathname + window.location.search + window.location.hash, // /path?s#hash
        ];
        activeItem = state.find(i => locationSets.indexOf(i.to) !== -1);
      } else {
        activeItem = findItem(state, action.value, action.propName);
      }

      // If metismenu user tries to activate non-exist item
      if (!activeItem) return state;

      const { id, parentId, trace } = activeItem;
      const stage = state.map(i => item(i, Object.assign({ id, trace }, action)));

      // Trace also keeps parentId nonetheless it doesn't matter
      return content(stage, changeSubMenuVisibility(parentId, trace, true));
    }
    default: {
      return state;
    }
  }
};

export default content;
