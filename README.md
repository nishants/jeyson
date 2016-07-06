# jso-ng
A __creatively simplified__ json template engine.

## Syntax
```javascript
compiler.compile(scope , template, config):
```
- A json is a valid template in itself
- You can use expressions inside jsons
- Every template is rendered within a defined scope.

### Scope
Defines context for temlpate,

e.g.  Given scope defined as :
 ```javascript
var scope    = {message: "Hello !"},
```
Then following __template.json__ :
```javascript
{
  "message": "{{message}}"
}
```
compiles to
```javascript
{
  "message": "Hello !"
}
```

