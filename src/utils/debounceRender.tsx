/*
 * Copied from
 * https://github.com/podefr/react-debounce-render/blob/ebc4133c7fc9c106d7a8671b5f9d9bff991971ee/packages/react-debounce-render/src/index.tsx
 * (MIT License)
 *
 * https://github.com/podefr/react-debounce-render
 *
 * The original library seems to be packaged incorrectly, in that it contains
 * ES6/JSX (not just raw JS) in its build, which broke tests upon first testing.
 * So copied the brief source directly here instead.
 */
import hoistNonReactStatics from "hoist-non-react-statics";
import type { DebounceSettings } from "lodash";
import _debounce from "lodash/debounce";
import { Component, type ComponentType } from "react";

function debounceRender<T>(
  ComponentToDebounce: ComponentType<T>,
  wait?: number,
  debounceArgs?: DebounceSettings
): ComponentType<T> {
  class DebouncedContainer extends Component<T> {
    public static readonly displayName = `debounceRender(${
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      ComponentToDebounce.displayName || ComponentToDebounce.name || "Component"
    })`;
    // eslint-disable-next-line @typescript-eslint/unbound-method
    updateDebounced = _debounce(this.forceUpdate, wait, debounceArgs);

    shouldComponentUpdate() {
      this.updateDebounced();
      return false;
    }

    componentWillUnmount() {
      this.updateDebounced.cancel();
    }

    render() {
      return <ComponentToDebounce {...this.props} />;
    }
  }

  return hoistNonReactStatics(DebouncedContainer, ComponentToDebounce);
}

export default debounceRender;
