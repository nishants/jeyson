## JSO-NG

 - JSO-NG is a templating language for serving json content. \
 - It extends the notion of compiling html templates to json.

- A json is a valid template in itself
- You can use expressions inside jsons
- Every template is rendered within a defined scope.

### Compiling Templates
```javascript
var jsong         = require('jso-ng').create(),
    scope         = {message: 'Hello!'},
    templateJson  = '{"message": "{{message}}"}',
    compiled      = compiler.compile(scope , templateJson);
```

### Expressions
 - An expression is a field value, enclosed in '{{__javascript__}}'

Following __template.json__  :
```javascript
{
  "age": "{{21 + 33}}"
}
 ```
 is compiled to
 ```javascript
 {
  "age": 54
 }
 ```
 - You can place a javascript snippet inside an expression.

Following __template.json__  :
```javascript
{
  "list"      : "{{'one,two,three,four,five'.split(',')}}",
}
 ```
is compiled to
 ```javascript
{
  "list"    : ["one", "two", "three", "four", "five"],
}
 ```



### Scopes
#### Any field on scope object is available as local variable in expressions

e.g.  Given scope defined as :
 ```javascript
var scope    = {message: "Hello !"},
```
then following __template.json__  :
```javascript
{
  "message": "{{message}}"
}
```
is compiled to
```javascript
{
 "message": "Hello !"
}
```

#### Methods on scope can also be called back from expressions

e.g.  Given scope defined as :
 ```javascript
var scope = {
    message: function(){
      return "Hello !";
    }
};
```
then following __template.json__  :
```javascript
{
  "message": "{{message()}}"
}
```
is compiled to
```javascript
{
 "message": "Hello !"
}
```

### Using Directives
 - [Define when an element becomes a directive]

### Inbuilt Directives
### Custom Directives
  - Modifying
  - Modifying
  - Replacing directive contents
  - Source code of inbuilt directives





