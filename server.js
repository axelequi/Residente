const http=require('http');
const url=require('url');
const fs=require('fs');
const querystring = require('querystring');

const mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  : 'audio/mpeg3',
   'mp4'  : 'video/mp4'
};

const servidor=http.createServer((pedido ,respuesta) => {
    const objetourl = url.parse(pedido.url);
  let camino='public'+objetourl.pathname;
  if (camino=='public/')
    camino='public/index.html';
  encaminar(pedido,respuesta,camino);
});



var server_port = process.env.YOUR_PORT || process.env.PORT || 8888;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
servidor.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});




function encaminar (pedido,respuesta,camino) {
  console.log(camino);
  switch (camino) {
    case 'public/numeropresidente': {
      recuperar(pedido,respuesta);
      break;
    }	
    default : {  
      fs.stat(camino, error => {
        if (!error) {
        fs.readFile(camino,(error, contenido) => {
          if (error) {
            respuesta.writeHead(500, {'Content-Type': 'text/plain'});
            respuesta.write('Error interno');
            respuesta.end();					
          } else {
            const vec = camino.split('.');
            const extension=vec[vec.length-1];
            const mimearchivo=mime[extension];
            respuesta.writeHead(200, {'Content-Type': mimearchivo});
            respuesta.write(contenido);
            respuesta.end();
          }
        });
      } else {
        respuesta.writeHead(404, {'Content-Type': 'text/html'});
        respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');		
        respuesta.end();
        }
      });	
    }
  }	
}


function recuperar(pedido,respuesta) {
  let info = '';
  pedido.on('data', datosparciales => {
    info += datosparciales;
  });
  pedido.on('end', () => {
    const formulario = querystring.parse(info);
    var vector=[];
    let i;
    const a=parseInt(formulario['numa']);
    const b=parseInt(formulario['numb']);
    for(i=a;i<=b;i++)
    {
      if(EsPrimo(i))
      {
        vector.push(i);
      }
    }
    let cadena=vector.join(' ');
    respuesta.writeHead(200, {'Content-Type': 'text/html'});
    const pagina=
      `<!doctype html><html><head>
	  <head>
  <title>tp Presidente</title>
  <meta charset="UTF-8">
   
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
</head>
	  
	   <body>
	   <p> Los Números del presidente son: </p>
       ${cadena}<br>
	    <a href="index.html"   class="btn btn-dark" type="submit" value="Enviar">Inicio</button></a>
  </body></html>`;
    respuesta.end(pagina);
  });	
}

function EsPrimo(n)
{
  let numConfirmado=false;
    if(n%2!=0 && n%3!=0 && n%5!=0 && n!=1 || n==3 || n==5 || n==2)
    {
      let numstring=n.toString();
      let suma=0;
      for(let i=0;i<numstring.length;i++)
      {
        suma+=parseInt(numstring[i]);
      }

      if(suma%2!=0 && suma%3!=0 && suma%5!=0 || suma==3 || suma==5 || suma==2)
      {
        numConfirmado=true;
      }
    }
    return numConfirmado;
}

console.log('Servidor web iniciado');