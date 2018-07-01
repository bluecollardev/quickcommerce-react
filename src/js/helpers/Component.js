function componentIsWrappedWithInjector(component) {
  return component.hasOwnProperty('wrappedComponent')
}

function instanceIsWrappedWithInjector(component) {
  return component.hasOwnProperty('wrappedInstance')
}

function isFormComponent(component) {
  return component.hasOwnProperty('component')
}

function resolveComponent(component) {
  if (componentIsWrappedWithInjector(component)) {
    return component.wrappedComponent
  } else if (instanceIsWrappedWithInjector(component)) {
    return component.wrappedInstance
  } else if (isFormComponent(component)) {
    return component.component
  }

  return component
}

function unwrapComponent(target) {
  if (typeof target === 'undefined' || target === null) {
    throw new Error('Cannot unwrap target - invalid target provided')
  }

  // If the target isn't wrapped, just return it, it's all good
  if (!isFormComponent(target) &&
    !instanceIsWrappedWithInjector(target) &&
    !componentIsWrappedWithInjector(target)) {
    return target
  }

  // Otherwise, resolve the component and test the result again
  return unwrapComponent(resolveComponent(target))
}

export { unwrapComponent, resolveComponent }
