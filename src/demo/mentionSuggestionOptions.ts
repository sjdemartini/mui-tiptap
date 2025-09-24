import { computePosition, flip, shift } from "@floating-ui/dom";
import type { Editor } from "@tiptap/core";
import type { MentionOptions } from "@tiptap/extension-mention";
import { ReactRenderer, posToDOMRect } from "@tiptap/react";
import SuggestionList, { type SuggestionListRef } from "./SuggestionList";

export type MentionSuggestion = {
  id: string;
  mentionLabel: string;
};

const updatePosition = (editor: Editor, element: Element) => {
  if (!(element instanceof HTMLElement)) {
    // Defensive, to appease TypeScript
    return;
  }
  const virtualElement = {
    getBoundingClientRect: () =>
      posToDOMRect(
        editor.view,
        editor.state.selection.from,
        editor.state.selection.to,
      ),
  };

  void computePosition(virtualElement, element, {
    placement: "bottom-start",
    strategy: "absolute",
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }) => {
    element.style.width = "max-content";
    element.style.position = strategy;
    element.style.left = `${x.toFixed(0)}px`;
    element.style.top = `${y.toFixed(0)}px`;
  });
};

export const mentionSuggestionOptions: MentionOptions["suggestion"] = {
  // Replace this `items` code with a call to your API that returns suggestions
  // of whatever sort you like (including potentially additional data beyond
  // just an ID and a label). It need not be async but is written that way for
  // the sake of example.
  items: async ({ query }): Promise<MentionSuggestion[]> =>
    Promise.resolve(
      [
        "Lea Thompson",
        "Cyndi Lauper",
        "Tom Cruise",
        "Madonna",
        "Jerry Hall",
        "Joan Collins",
        "Winona Ryder",
        "Christina Applegate",
        "Alyssa Milano",
        "Molly Ringwald",
        "Ally Sheedy",
        "Debbie Harry",
        "Olivia Newton-John",
        "Elton John",
        "Michael J. Fox",
        "Axl Rose",
        "Emilio Estevez",
        "Ralph Macchio",
        "Rob Lowe",
        "Jennifer Grey",
        "Mickey Rourke",
        "John Cusack",
        "Matthew Broderick",
        "Justine Bateman",
        "Lisa Bonet",
        "Benicio Monserrate Rafael del Toro Sánchez",
      ]
        // Typically we'd be getting this data from an API where we'd have a
        // definitive "id" to use for each suggestion item, but for the sake of
        // example, we'll just set the index within this hardcoded list as the
        // ID of each item.
        .map((name, index) => ({ mentionLabel: name, id: index.toString() }))
        // Find matching entries based on what the user has typed so far (after
        // the @ symbol)
        .filter((item) =>
          item.mentionLabel.toLowerCase().startsWith(query.toLowerCase()),
        )
        .slice(0, 5),
    ),

  render: () => {
    let reactRenderer: ReactRenderer<SuggestionListRef> | undefined;

    return {
      onStart: (props) => {
        if (!props.clientRect) {
          return;
        }

        reactRenderer = new ReactRenderer(SuggestionList, {
          props,
          editor: props.editor,
        });

        if (!(reactRenderer.element instanceof HTMLElement)) {
          // Defensive, to appease TypeScript
          return;
        }
        reactRenderer.element.style.position = "absolute";
        document.body.appendChild(reactRenderer.element);
        updatePosition(props.editor, reactRenderer.element);
      },

      onUpdate(props) {
        reactRenderer?.updateProps(props);

        if (!props.clientRect || !reactRenderer) {
          return;
        }

        updatePosition(props.editor, reactRenderer.element);
      },

      onKeyDown(props) {
        if (props.event.key === "Escape") {
          reactRenderer?.destroy();
          reactRenderer?.element.remove();
          return true;
        }

        return reactRenderer?.ref?.onKeyDown(props) ?? false;
      },

      onExit() {
        reactRenderer?.destroy();
        reactRenderer?.element.remove();
        // Remove references to the old reactRenderer upon destruction/exit.
        // (This should prevent memory leaks and redundant calls to `destroy()`,
        // since based on original testing with Tiptap v2, the `suggestion`
        // plugin seems to call `onExit` both when a suggestion menu is closed
        // after a user chooses an option, *and* when the editor itself is
        // destroyed.)
        reactRenderer = undefined;
      },
    };
  },
};
