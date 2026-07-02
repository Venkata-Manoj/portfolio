import React from 'react'

// Framer-motion props that should not be passed to DOM elements
var MOTION_PROPS = [
  'initial', 'animate', 'exit', 'whileHover', 'whileTap', 'whileFocus',
  'whileInView', 'whileDrag', 'viewport', 'transition', 'variants',
  'layout', 'layoutId', 'layoutDependency', 'onLayoutAnimationStart',
  'onLayoutAnimationComplete', 'drag', 'dragConstraints', 'dragElastic',
  'dragMomentum', 'dragPropagation', 'dragSnapToOrigin', 'dragControls',
  'onDragStart', 'onDrag', 'onDragEnd', 'onDirectionLock',
  'style', // style is handled separately to filter motion values
]

function createMotionComponent(tag) {
  var Component = React.forwardRef(function MotionComponent(props, ref) {
    var rest = {}
    for (var key in props) {
      if (props.hasOwnProperty(key) && MOTION_PROPS.indexOf(key) === -1) {
        rest[key] = props[key]
      }
    }
    return React.createElement(tag || 'div', { ref: ref, ...rest })
  })
  Component.displayName = 'Motion' + (tag || 'div')
  return Component
}

// Proxy that intercepts any motion.<tag> access
var motion = new Proxy({}, {
  get: function(_, tag) { return createMotionComponent(tag) },
})

export { motion }
export default motion

export function AnimatePresence(_ref) {
  return React.createElement(React.Fragment, null, _ref.children)
}

// MotionValue mock
function createMotionValue(initial) {
  return {
    get: function() { return initial != null ? initial : 0 },
    set: function() {},
    onChange: function() {},
    on: function() { return function() {} },
    stop: function() {},
    isAnimating: function() { return false },
    destroy: function() {},
  }
}

export function useMotionValue(initial) {
  return createMotionValue(initial)
}

export function useTransform(input) {
  return createMotionValue(input ? input.get() : 0)
}

export function useScroll() {
  return { scrollY: createMotionValue(0), scrollX: createMotionValue(0) }
}

export function useInView() { return true }
export function useAnimation() { return { start: function() {}, stop: function() {} } }
export function useAnimationControls() { return { start: function() {}, stop: function() {} } }

export function animate() {
  return { stop: function() {}, play: function() {}, pause: function() {}, then: function() {} }
}

export function spring() {}
export function tween() {}
export function useSpring() { return createMotionValue(0) }
export function useVelocity() { return createMotionValue(0) }
export function useTime() { return createMotionValue(0) }
export function useMotionTemplate() { return '' }
export function useWillChange() { return { add: function() {}, remove: function() {} } }
