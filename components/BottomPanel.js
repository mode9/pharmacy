// import {createContext, useState, useEffect, useContext, useRef} from "react";
// import {useSpring} from "framer-motion";
// import {config} from "react-spring";
// import {useGesture} from "@use-gesture/react";
// import {useStyletron} from "baseui";
// import {Button} from "baseui/button";
//
// /**
//  * Context for use with useDragContext, this allows us to expose
//  * `{ y, interpolate, drawerOpen, interpolate }` to children
//  * without having to prop-drill.
//  */
// const DragContext = createContext({});
//
// /**
//  * Get access to the { y, interpolate, drawerOpen, interpolate } properties of the BottomPanel
//  * @returns An object like { y, interpolate, drawerOpen, interpolate }
//  */
// export function useDragContext() {
//     const context = useContext(DragContext);
//     if (context === undefined) {
//         throw new Error(`useDragContext must be called from inside a BottomPanel`);
//     }
//     return context;
// }
//
// /**
//  * This is hook listens for keyboardStateChange events on the window,
//  * and returns a state containing the `.keyboardHeight` prop from those
//  * events. Obviously this is NOT a standard DOM event - this event
//  * is emulated by our App.js by listening to @capacitor/keyboard
//  * events. Since Capacitor's Keyboard plugin DOES NOT
//  * support 'removeEventListener', we emit a fake event in App.js
//  * which we listen for here.
//  * @returns Height of the keyboard
//  */
// export function useKeyboardHeight() {
//     const [height, setHeight] = useState(0);
//     useEffect(() => {
//         const keyboardStateChanged = ({ keyboardHeight }) => {
//             setHeight(keyboardHeight || 0);
//         };
//
//         window.addEventListener('keyboardStateChanged', keyboardStateChanged);
//         return () => {
//             window.removeEventListener('keyboardStateChanged', keyboardStateChanged);
//         };
//     }, []);
//
//     return height;
// }
//
// /**
//  * Wrap the window 'resize' event and call the `resizeCb` every time the window resizes.
//  * @param {function} resizeCb Function to execute when window is resized
//  */
// export function useWindowResized(resizeCb = () => {}) {
//     useEffect(() => {
//         window.addEventListener('resize', resizeCb);
//         return () => {
//             window.removeEventListener('resize', resizeCb);
//         };
//     }, [resizeCb]);
// }
//
// /**
//  * Helper wrapper around useWindowResized() and a state variable that calls the
//  * provided `getSizeCb` to get a new size whenever the window is resized
//  * and then tracks that size in a state variable which it returns.
//  *
//  * This is important for mobile usage, because if there is an input
//  * in the BottomPanel and it gains focus, which opens the keyboard,
//  * this will resize the window. If your maxOpenHeight/closedPanelSize don't
//  * recalculate, your input could be forced offscreen.
//  *
//  * If no callback given, just returns the full window height and will update
//  * whenever the window resizes.
//  *
//  * Example usage:
//  * ```
//  * const maxOpenHeight = useWindowRelativeSize((windowHeight) => windowHeight * 0.8);
//  * // Later:
//  * <BottomPanel maxOpenHeight={maxOpenHeight} />
//  * ```
//  *
//  * @param {function} getSizeCb Function that receives the window.innerHeight and returns a number. If no callback given, uses a default callback that just returns the full window height.
//  * @returns A state variable that is updated when the window is resized or getSizeCb changes referentially
//  */
// export function useWindowRelativeSize(getSizeCb = (height) => height) {
//     const keyboardHeight = useKeyboardHeight();
//     const [size, setSize] = useState(
//         getSizeCb(window.innerHeight - keyboardHeight),
//     );
//     useWindowResized(() => {
//         setSize(getSizeCb(window.innerHeight - keyboardHeight));
//     });
//
//     useEffect(() => {
//         setSize(getSizeCb(window.innerHeight - keyboardHeight));
//     }, [getSizeCb, keyboardHeight]);
//
//     return size;
// }
//
// /**
//  * Purpose-built utility to find a parent node of `startNode`
//  * that is scrollable (e.g. the content is larger than the node size).
//  * This function will stop searching if it encounters a node
//  * with a class containing the `stopClass`. If a scrollable parent is found,
//  * that node is returned. If no scrollable parent found,
//  * if `stopClass` is encountered, or if we reach the top of the DOM,
//  * `null` is returned.
//  *
//  * This function is crucial in allowing scrollable areas to exist inside
//  * the sheet and allowing the user to scroll those areas without
//  * also dragging the sheet up or down.
//  *
//  * @param {HTMLElement} startNode Node to start searching at
//  * @param {string} stopClass (optional) Class Name to break the search at (returns null if encountered on a parent)
//  * @returns {HTMLElement|null} Returns the the scrollable node found, or `null` if no scrollable node found or `stopClass` found or reached the root of the DOM
//  */
// function findScrollableParentNode(startNode, stopClass) {
//     let el = startNode;
//     while (el.parentNode) {
//         el = el.parentNode;
//         if (stopClass && Array.from(el.classList).includes(stopClass)) {
//             return null;
//         }
//         if (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) {
//             return el;
//         }
//     }
//     return null;
// }
//
//
// /**
//  * Renders a bottom panel which exposes a custom amount of content
//  * at the bottom of the screen in a "closed" state, along with an animated
//  * drag handle. The panel can then be "swiped" / "dragged" open by clicking
//  * or touching anywhere in the panel. The drag handle will animate smoothly
//  * between open/closed arrow states. The max open size of the panel can
//  * also be customized, defaults to entire window height. The BottomPanel
//  * wraps any children provided in a custom content area with overflow
//  * scrolling already enabled and tested to work with the swipe handlers.
//  *
//  * Default styles applied provide border radius, box shadow, background,
//  * and other basic styles on the top-level sheet. These can be customized
//  * by providing a custom `className` to override/add styles.
//  *
//  * You can also customize the content area (e.g. add padding or disabling
//  * overflow scrolling) by giving a custom `contentClassName` to override/
//  * add new styles to the content area.
//  *
//  * The drag handle can be disabled via `hideDragHandle` or changed from
//  * arrows to a straight bar indicator by setting `barIndicator` to true.
//  *
//  * Programmatic opening/closing of the panel can be achieved by using
//  * the `actionsRef` prop - see docs below on that prop.
//  *
//  * `closedPanelSize` reacts dynamically to prop changes as long as panel is closed.
//  *
//  * Note that children can access the `y`, `interpolate`, `movementAmount`,
//  * and `drawerOpen` internal states via the exported `useDragContext`
//  * hook. This allows children to access these props without prop-drilling
//  * via a render function.
//  *
//  * The movement amount is also exposed in an `onMovement` callback.
//  *
//  * See PropTypes documentation below for more information on individual props.
//  */
// export default function BottomPanel({
//                                         closedPanelSize = 100, // px
//                                         maxOpenHeight: maxOpenHeightIncoming = null,
//                                         actionsRef = {},
//                                         className,
//                                         contentClassName,
//                                         barIndicator = false,
//                                         hideDragHandle = false,
//                                         children,
//                                         onOpenClose,
//                                         onMovement,
//                                         clampDragToLimits = false,
//                                         disableDrag,
//                                         disableContentHeightInterpolation = false,
//                                     }) {
//     const keyboardHeight = useKeyboardHeight();
//     const windowHeight = useWindowRelativeSize();
//     const maxOpenHeight = maxOpenHeightIncoming || windowHeight;
//
//     const height = maxOpenHeight - closedPanelSize;
//     const [{ y }, set] = useSpring(() => ({ y: height }));
//
//     const [drawerOpen, setDrawerOpen] = useState();
//     const [movementAmount, setMovementAmount] = useState(0);
//     const [dragging, setDragging] = useState();
//
//     // Sync the closedPanelSize with actual panel state
//     // as long as the panel is "closed"
//     const closedPanelSizeRef = useRef(closedPanelSize);
//     if (closedPanelSizeRef.current !== closedPanelSize) {
//         closedPanelSizeRef.current = closedPanelSize;
//         if (!drawerOpen) {
//             set({
//                 y: maxOpenHeight - closedPanelSize,
//                 immediate: false,
//                 config: config.stiff,
//             });
//         }
//     }
//
//     const open = ({ canceled } = {}) => {
//         setDrawerOpen(true);
//         // when cancel is true, it means that the user passed the upwards threshold
//         // so we change the spring config to create a nice wobbly effect
//         set({
//             y: 0,
//             immediate: false,
//             config: canceled ? config.wobbly : config.stiff,
//         });
//
//         if (typeof onOpenClose === 'function') {
//             onOpenClose(true);
//         }
//
//         if (typeof onMovement === 'function') {
//             onMovement(1);
//         }
//
//         setMovementAmount(1);
//     };
//
//     const close = (velocity = 0) => {
//         setDrawerOpen(false);
//         set({ y: height, immediate: false, config: { ...config.stiff, velocity } });
//
//         if (typeof onOpenClose === 'function') {
//             onOpenClose(false);
//         }
//
//         if (typeof onMovement === 'function') {
//             onMovement(0);
//         }
//
//         setMovementAmount(0);
//     };
//
//     const toggleDrawer = () => {
//         if (drawerOpen) {
//             close();
//         } else {
//             open();
//         }
//         return !drawerOpen;
//     };
//
//     // Expose programmatic controls
//     // eslint-disable-next-line no-param-reassign
//     actionsRef.current = {
//         open,
//         close,
//         toggleDrawer,
//     };
//
//     // See notes in `onDragStart` for the purpose of this ref
//     const scrollableParentRef = useRef();
//
//     // We use the useGesture hook instead of the useDrag hook
//     // so we can access the `onDragStart` handler to find scrollable parent nodes.
//     // See notes in `onDragStart` on why this is needed.
//     const bind = useGesture(
//         {
//             onDrag: ({
//                          last,
//                          vxvy: [, vy],
//                          movement: [, my],
//                          cancel,
//                          canceled,
//                          direction: [, dy],
//                      }) => {
//                 // Cancel the drag if dragging inside a scrollable node
//                 // inside the sheet. See notes below in onDragStart() for why/how.
//                 if (scrollableParentRef.current) {
//                     cancel();
//                     return;
//                 }
//
//                 // if the user drags up passed a threshold, then we cancel
//                 // the drag so that the sheet resets to its open position
//                 if (my < -70) {
//                     cancel();
//                 }
//
//                 // Clamp the drag to limits (top/bottom) if flag set
//                 const activeMy = clampDragToLimits
//                     ? Math.max(0, Math.min(height, my))
//                     : my;
//
//                 const openPercent = 1 - activeMy / height;
//                 setMovementAmount(openPercent);
//
//                 if (typeof onMovement === 'function') {
//                     onMovement(openPercent);
//                 }
//
//                 // when the user releases the sheet, check direction last moving
//                 // and open or close based on swiping up or down
//                 if (last) {
//                     if (dy > 0) {
//                         close(vy);
//                     } else {
//                         open({ canceled });
//                     }
//                     setDragging(false);
//                 }
//                     // when the user keeps dragging, we just move the sheet according to
//                 // the cursor position
//                 else
//                     set({
//                         y: activeMy,
//                         immediate: true,
//                     });
//             },
//             onDragStart: ({ event: { target } }) => {
//                 // This is CRUCIAL to allowing content within the sheet to still be
//                 // scrollable (e.g. overflow: auto) without also dragging the
//                 // sheet up/down while scrolling up/down.
//                 // By looking for a scrollable parent (and stopping if we hit
//                 // the .sheet without finding a scrollable node), we can then
//                 // cancel the drag movement (above) if the drag gesture started
//                 // inside a scrollable node. This allows not only scrolling to work,
//                 // but taps inside the scrollable node to work as well.
//                 //
//                 // Note: We tried calling the state.cancel() method documented
//                 // from inside this onDragStart handler, but that did not stop
//                 // onDrag from starting anyway, so we use the ref here to
//                 // communicate with onDrag so it can cancel itself.
//                 //
//                 // We do the findScrollableParentNode() HERE in onDragStart because
//                 // it is potentially expensive if it has to traverse a lot of DOM nodes.
//                 // So we only do it at the start and then cache the result in the ref.
//                 // This allows drags that are NOT in a scrollable node (e.g.
//                 // we really want / that are legit drags) to move as smoothly as possible
//                 // because they aren't calling findScrollableParentNode() on every
//                 // move of the finger/mouse.
//                 const node = findScrollableParentNode(target, 'sldk');
//                 scrollableParentRef.current = node;
//                 setDragging(true);
//             },
//         },
//         {
//             drag: {
//                 initial: () => [0, y.get()],
//                 filterTaps: true,
//                 bounds: { top: 0 },
//                 rubberband: true,
//             },
//         },
//     );
//
//     // These transformations represent the modifications to the
//     // underlying before/after elements on the drag handle necessary to render
//     // the open/closed arrow states. We rely on react-spring to interpolate
//     // the intermediate frames in the `arrowStyle` prop below.
//     const arrowStates = {
//         closeArrow: {
//             before: 'translateX(calc(-50% - 0.675rem)) rotate(7deg)',
//             after: 'translateX(calc(-50% + 0.675rem)) rotate(-7deg)',
//         },
//         openArrow: {
//             before: 'translateX(calc(-50% - 0.675rem)) rotate(-7deg)',
//             after: 'translateX(calc(-50% + 0.675rem)) rotate(7deg)',
//         },
//     };
//
//     // Interpolate helper for use below and exposure to children
//     const interpolate = (from, to) => y.to([0, height], [to, from]);
//
//     const arrowStyle = barIndicator
//         ? {}
//         : {
//             // Interpolate between open/closed arrow states based on the
//             // current drag state
//             '--custom-before-tx': interpolate(
//                 arrowStates.openArrow.before,
//                 arrowStates.closeArrow.before,
//             ),
//             '--custom-after-tx': interpolate(
//                 arrowStates.openArrow.after,
//                 arrowStates.closeArrow.after,
//             ),
//         };
//
//     // This is the state we expose to children via a render function
//     // (if typeof children === 'function') and via the `useDragContext` hook above.
//     const dragContextState = {
//         drawerOpen: !!drawerOpen,
//         movementAmount,
//         // Expose react-spring utilities for use in
//         // interpolation and potential advanced control by content
//         y,
//         set,
//         height,
//         interpolate,
//     };
//
//     const [css] = useStyletron();
//
//     return (
//         <div
//             className={css({
//                 height: '100vh',
//
//                 //     styles.sheet,
//                 //     className,
//                 //     drawerOpen &&
//                 // maxOpenHeight === window.innerHeight &&
//                 // styles.fullWindowHeight,
//             }+ ' sldk')}
//             {...(disableDrag ? {} : bind())}
//             style={{
//                 y,
//                 bottom: `calc(-100vh + ${height}px + ${keyboardHeight}px)`,
//                 '--closed-panel-size': `${closedPanelSize}px`,
//                 // This height interpolation is necessary to ensure the content
//                 // can be scrolled all the way to the bottom regardless of if the panel
//                 // is open or closed
//                 // Users can choose to disable content height interpolation
//                 // if they know the last item in the panel is longer than the panel
//                 // and the panel overflows. (E.g. the ChooseDropoffWidget)
//                 // but for widgets where the content area is 'display: flex' and doesn't
//                 // overflow, interpolation prevents the content from "jumping" during drag.
//                 '--content-height': disableContentHeightInterpolation
//                     ? `${dragging || drawerOpen ? maxOpenHeight : closedPanelSize}px`
//                     : interpolate(`${closedPanelSize}px`, `${maxOpenHeight}px`),
//                 // Could do disable interpolation on --native-padding-adjust
//                 // but I feel like this is really needed. If we don't interpolate,
//                 // when used on a mobile device that has `--native-top-adjust` set,
//                 // the control arrow will jump at start/end of drag.
//                 // '--native-padding-adjust': drawerOpen
//                 // 	? `calc(var(--native-top-adjust) * 1)`
//                 // 	: `calc(var(--native-top-adjust) * 0)`,
//                 '--native-padding-adjust': hideDragHandle
//                     ? ''
//                     : interpolate(
//                         `calc(var(--native-top-adjust) * 0)`,
//                         `calc(var(--native-top-adjust) * 1)`,
//                     ),
//             }}
//         >
//             {!hideDragHandle && (
//                 <div
//                     className=''
//                     style={arrowStyle}
//                     onClick={toggleDrawer}
//                 >
//                     {/* Just using ButtonBase for the ripples, nothing more.
// 					    Feel free to disable/remove if MaterialUI not used. */}
//                     <Button />
//
//                 </div>
//             )}
//
//             <div className={contentClassName}>
//                 <DragContext.Provider value={dragContextState}>
//                     {typeof children === 'function'
//                         ? children(dragContextState)
//                         : children}
//                 </DragContext.Provider>
//             </div>
//         </div>
//     );
// }