# quickcommerce-react by firebrandsolutions
##### UI Framework and Component Library
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

### Services

### Actions

### Third-Party Libraries

#### quickcommerce-react

#### react-bootstrap

#### material-ui

#### bootstrap-sass
