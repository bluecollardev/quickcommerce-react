# quickcommerce-react
##### React Components for the QuickCommerce E-commerce Platform
This is a work in progress...
### Organization
+ src/app/js
  - Main.jsx
    + Entry point, wraps MainComponent with a Provider which injects dependencies as props via React's context mechanism
  - QC.jsx
    + The "MainComponent" - Renders the application layout (PageLayout), menus, and React Router routes.
  - /actions
  - /adapters
  - /animations
  - /components
  - /constants
  - /dispatcher
  - /forms
  - /helpers
  - /layouts
  - /mappings
  - /models
  - /pages
  - /services
  - /steps
  - /stores
  - /styles

### Component Hierarchy

Pages (Container) -> Top Level Components* (Container/Smart) -> Composite Entity Components (Smart) -> Entity Sub-Components (Dumb) OR FormComponent-Wrapped Components

#### Pages
- Render (an) appropriate configuration(s) of (a) Top Level component(s) given a certain route and parameters.
- Are analagous to "Container" components in some React literature.
- If the Page is used for creating/editing a SINGLE entity, then is responsible for loading the entity data by ID
- if the Page is used to list MULTIPLE entities of a given type, loading the collection data is delegated to the Top Level component.
  * Note: I am considering changing this in the future. The approach we're taking with the SINGLE entity pages may be preferable. Pages should be dumb, possibly implemented as 'functional' components that simply render as set of children in a particular layout (ie: displays a menu component and a content component). Top Level Components and Composite Entity Components should be the only components that are allowed to communicate with the backend (via JS client services).
- If the Page is used for creating/editing a SINGLE entity, it listens to stores for changes and updates child (in particular the Top Level) components.

#### Top Level Components
- Located in the top level of the components folder.
- Suffixed with 'Component' (ie: CustomerComponent).
- If the component is used to list MULTIPLE entities of a given type, it listens to stores for changes and updates child (in particular the Top Level) components.
- For a good example of the functionality implemented by a Top Level Component please take a look at CustomerComponent.jsx.

#### Composite Entity Components
- Composite Entity Components are composed of one or more FormComponents. They are responsible for (CRUD) saving or storing changes to, and creating or deleting Top Level entities (a Customer, a Deal, a Vehicle, etc.); they use a combination of services and actions to apply changes and relay any changes to sub-components.
- Although I DON'T CURRENTLY HAVE AN INTERFACE IN PLACE (it's coming, just got flow working) composite components should include (via composition or extension?):
  + a getForm() method which grabs all subforms and assembles their data into a single object,
  + a getSubform() method which grabs a single subform using its 'ref' (React's mechanism for referencing sub-components),
  + a triggerAction() method that executes a callback providing a single argument - the result of getForm() (ie: return callback(this.getForm())),
  + an onCreate(e) method that invokes triggerAction providing a custom callback that encapsulates any service (CRUD) operations and action calls,
  + an onUpdate(e) method that invokes triggerAction providing a custom callback that encapsulates any service (CRUD) operations and action calls,
  + an onDelete(e) method that invokes triggerAction providing a custom callback that encapsulates any service (CRUD) operations and action calls,
  + an onCancel() method,
  + an onCreateSuccess method, executed after a successful onCreate call,
  + an onSaveSuccess method, executed after a successful onUpdate call,
  + and a renderErrors() method.

#### Entity Sub-Components

#### FormComponent-Wrapped Components

At the core of QuickCommerce's form handling is the FormComponent HoC.
 + 2-way binds form data from inputs in a FormComponent wrapped form to their respective Dtos.
 + Provides helper methods for accessing using primitive or typed form data using mapped properties.
 + Provides a getField method which registers and adds a field and it's initial value to FormComponent's 'fields' registry.
 + getField returns a JSX string that can be used to bind any input, select, checkbox, radio or textarea field (etc.) to FormComponent for easy form manipulation.
 + Provides a simple getForm method which returns the content of the wrapped form and any linked FormComponent sub-forms.
 
The following example shows how to bind a form input to a FormComponent instance
```javascript
@inject(deps => ({
  mappings: deps.mappings
})) @observer
class SampleForm extends AbstractFormComponent {
}
```
```javascript
render() {
  const { data, brands } = this.state
  const mappings = this.props.mappings.inventoryItem
  return (
    <InputFormControl type='number' fields={fields} mapping={mappings.PRICE} data={data} />
  )
}
```
```javascript
render() {
  const { data, brands } = this.state
  const mappings = this.props.mappings.inventoryItem
  return (
    <SampleForm
      ref={(item) => this.item = item}
      {...this.props}
      brands={brands}
      getBrands={this.getBrands}
      data={data}
    />
    <InputFormControl type='number' fields={fields} mapping={mappings.PRICE} data={data} />
    <FormGroup className='col-sm-4 form-element form-select autocomplete-control-group'>
      <ControlLabel>Brand/Manufacturer</ControlLabel>
      <AutocompleteFormControl
        {...props}
        data={data}
        mappings={{
          field: mappings.BRAND,
          id: mappings.BRAND_ID,
          code: mappings.BRAND_CODE
        }}
        items={makes}
        shouldItemRender={props.matchItemToTerm}
        onChange={props.onBrandValueChanged}
        onSelect={props.onBrandItemSelected}
      />
    </FormGroup>
  )
}
```

### Update to Mappings!

Ok, folks, it's time to overhaul quickcommerce mappings as I get this lib production ready.
I need to refactor the mappings implementation to allow for reverse mapping of data types;
I also now have the need to support both flattened and typed object data mappings.

Sample:
```javascript
INVENTORY_MAKE: {
  // The property on the DTO that you're mapping to, one level only
  property: { property: 'make', value: 'make' },
  // A JSONPath to the nested property you want to use as the mapping value;
  // if not set the property value is assumed to be a primitive type.
  // May not need to be a JSON path... quickcommerce helpers may do the trick.
  value: { property: 'model', value: 'model' },
  // The typed object
  type: CodeTypeDto
}
```

Conversion regex: ^(.*:\s)\'([A-Za-z0-9]+)([\.A-Za-z0-9\[\]]+)?\'
Substitution: $1{ property: '$2', value: '$2$3' } // Don't bother with types just yet

After regex replace, don't forget to reformat the mappings files.
Now we need to update the mappings, which are all uppercased by design to make the (now happening) conversion easier.

Mapping usage replacement regex: (mappings\.[A-Z0-9_]+)() // The final () denotes empty capture group, so we can append
Substitution: $1.value

All mappings are simply mapped to a string right now so it's an easy replace. There may be some things that break,
but I don't expect they will be difficult to fix. Easy-peasy.

Update: In some places I don't use '.mappings.XYZ'; instead I'm using 'xyzFieldNames.XYZ.value'
Mapping usage replacement regex: (FieldNames\.[A-Z0-9_]+)() // The final () denotes empty capture group, so we can append
Substitution: $1.value

UPDATE 20180525:
There are some FormComponent->wrappedComponent.fields calls that are declared incorrectly.
Fix regex: (fields\(mappings.[A-Z-0-9_]+\.[a-z0-9_]+,\s[A-Za-z0-9_-]+)(,\s[A-Za-z0-9_-]+)(\))
Substitution: $1$3

UPDATE 20180601:
Sample regex to convert FormComponent FormControls to new style declarations...
I'm overhauling all library components.

Note: This fix needs to be applied line by line on a per-case basis. Just an example for me to reference.
Find: <(FormControl|DateInput).*(\{\.\.\.readOnlyAttr\}?).*mappings\.([A-Z-0-9_]+).*\/>
Replace: <$1 $2 fields={fields} mapping={mappings.$3} data={data} />
Note: Conditionally prefix FormControl with Input ie: Input$1

No way to regex replace autocomplete widgets, again, it's a manual effort.

```javascript
import { AutocompleteFormControl, matchItemToTerm } from quickcommerce-react/components/form/Autocomplete.jsx'
```

```javascript
<AutocompleteFormControl
  {...props}
  data={data}
  mappings={{
    field: mappings.,
    id: mappings.,
    code: mappings.
  }}
  items={}
  shouldItemRender={matchItemToTerm}
  onChange={props.}
  onSelect={props.}
/>
```

### Services

### Actions

### Component Types

#### Tiles

#### Cards

### Third-Party Libraries

#### quickcommerce-react

#### react-bootstrap

#### material-ui

#### bootstrap-sass
