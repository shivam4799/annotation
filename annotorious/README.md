<p align="center">
  <img width="345" src="https://raw.githubusercontent.com/recogito/annotorious/master/annotorious-logo-white-small.png" />
  <br/><br/>
</p>


## Using

```html
<head>
 
  <link rel="stylesheet" href="annotorious.min.css">
 <script type="text/javascript" src="annotorious.min.js"></script>
</head>
<body>
  <div id="content">
    <img id="hallstatt" src="640px-Hallstatt.jpg">
  </div>
  <script>
    (function() {
      var anno = Annotorious.init({
        image: 'hallstatt'
      });

      anno.loadAnnotations('annotations.w3c.json');
    })()
  </script>
 
</body>
```
Full documentation is [on the project website](https://recogito.github.io/annotorious/). Questions? Feedack? Feature requests? Join the 
[Annotorious chat on Gitter](https://gitter.im/recogito/annotorious).

[![Join the chat at https://gitter.im/recogito/annotorious](https://badges.gitter.im/recogito/annotorious.svg)](https://gitter.im/recogito/annotorious?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## License

[BSD 3-Clause](LICENSE) (= feel free to use this code in whatever way
you wish. But keep the attribution/license file, and if this code
breaks something, don't complain to us :-)

## Who's Using Annotorious

Using Annotorious? [Let us know!](https://gitter.im/recogito/annotorious)
