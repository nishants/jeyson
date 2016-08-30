## Milestone : Conditional Blocks & System Directives
Following are the conditional directives
 1. switch
 2. if
 3. ignore-if (a system directive)

### @switch
#### Will replace the body with "@<value>", "@default" or null based on choice.

```javascript
scope    = {role : {name: "admin"}}
template = {
"user"    : {
  "role"    : {
     "@switch"    : "role.name",
     "@admin"     : {"name" : "admin"},
     "@visitor"   : {"name" : "visitor"},
     "@default"   : {"name" : "guest"}
  }
}
```
Will compile to 
```javascript
template = {
   "user"   : {
   "role"  : {"name" : "admin"}
 }
```
### @if
#### Will set field value to null, "@then"  or "@else", by condition in "@if"

```javascript
{
  "author"  : "ABC",
  "book"    : {
    "@if"   : "1 == 1",
    "@then" : {"title" : "Harry Potter"}
}
```
will result in
```javascript
{
 "author"  : "ABC",
 "book"    : {"title" : "Harry Potter"}
}
```

```javascript
{
  "author"  : "ABC",
  "book"    : {
    "@if"   : "1 == 2",
    "@then" : {"title" : "Harry Potter"}
}
```

will result in
```javascript
{
 "author"  : "ABC",
 "book"    : null
}
```
### @else

```javascript
{
  "author"  : "ABC",
  "book"    : {
    "@if"   : "1 == 2",
    "@then" : {"title" : "Harry Potter"}
    "@else" : "unknown",
  }
}
```

will result in

```javascript
{
 "author"  : "ABC",
 "book"    : "unknown"
}
```

### @ignore-if
#### Will not render the field itself, if the condition is false.
e.g
```javascript
{
  "author"  : "ABC",
  "book"    : {
    "@ignore-if": "1 == 1",
    "title"     : "Harry Potter"
  }
}
```

will result in
```javascript
{
 "author"  : "ABC"
}
```

#### System Directives
These directives will get special treatment from compiler.
This was needed to allow ignoring a field-name from template .Doing this is not possible with custom directives.
Other inbuilt directives (@include, @repeat) are not system directives, but custom directives that come bundled by default.
This an experimental feature, and might not be supported in future (removing field-name itself seems have a smell about it).
