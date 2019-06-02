'use strict'

const express = require('express');
const bodyParser = require('body-parser'); 
const request = require('request');
const access_token = "EAAJpaVagG8oBAK49gC1U1PCOZB7HrlZCmK57tieu1fuIdJ2NmztaKOfTbu0SaPPsalZA803wjzFL6eyYECioHjJgoIwaZAiXSFvwO84M6SHVvfr5ZAphpRfuVWqMOdW8FQCrmG3BZC67tn3cKbjKi0iUllU4HS2mOM3gPwsWVqpgZDZD"

const app = express();

app.set('port', 5000); 
app.use(bodyParser.json()); 

app.get('/', function(req, response){
    response.send('Hola mundo WUAFF');
})

app.get('/webhook', function(req, response){
    if(req.query['hub.verify_token'] === 'pugpizza_token'){
        response.send(req.query['hub.challenge']);
    } else {
        response.send('Pug pizza dice que no tienes permisos WUAFF');
    }
})

app.post('/webhook', function(req, res){
    const webhook_event = req.body.entry[0];

    if (webhook_event.messaging){
        webhook_event.messaging.forEach(event =>{
            console.log(event);
            handleEvent(event.sender.id, event);
        })
    }
    res.sendStatus(200);
})

function handleEvent(senderId, event){
    if(event.message){
        if (event.message.quick_reply){
            handlePostback(senderId, event.message.quick_reply.payload);
        }else{
            handleMessage(senderId, event.message)
        }
    } else if(event.postback){
        handlePostback(senderId, event.postback.payload)
    }
}

function handleMessage(senderId, event){
    if(event.text){
        defaultMessage(senderId);
    } else if (event.attachments) {
        handleAttachments(senderId, event)
    }
}

function defaultMessage(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "Hola, gracias por usar nuestro servicio de respuetas rapida para pizza, estamos para servirte. ¿En que podemos ayudarte? ",
            "quick_replies":[
              {
                "content_type": "text",
                "title": "¿Quieres una pizza?",
                "payload": "PIZZAS_PAYLOAD"
              },
              {
                "content_type": "text",
                "title": "Acerca de",
                "payload": "ABOUT_PAYLOAD"
              }
            ]
        }
    }
    senderActions(senderId);
    callSendApi(messageData);
}

function handlePostback(senderId, payload){
    console.log(payload)
    switch (payload) {
        case "GET_STARTED_PUGPIZZA":
            defaultMessage(senderId);
        break;

        case "PIZZAS_PAYLOAD":
            showPizzas(senderId);
        break;

        case "DRINKS_PAYLOAD":
            showDrinks(senderId);
        break;
        case "LOCATIONS_PAYLOAD":
            showLocation(senderId);
        break;
        case "CONTACT_PAYLOAD": 
            contactSupport(senderId);
        break;



        case "PEPERONI_PAYLOAD":
            sizePizza(senderId)
        break;

        case "BBQ_PAYLOAD":
            sizePizza(senderId);
        break;

        case "HAWAIANA_PAYLOAD": 
            sizePizza(senderId);
        break;

        case "MEXICANA_PAYLOAD":
                sizePizza(senderId);
        break;



        case "PERSONAL_SIZE_PAYLOAD": 
            showDrinks(senderId);
        break;

        case "MEDIUM_SIZE_PAYLOAD":
            showDrinks(senderId);
        break;

        case "FAMILIAR_SIZE_PAYLOAD": 
            showDrinks(senderId);
        break;



        case "REFRESCO_PAYLOAD":
            messageExtra(senderId);
        break;   

        case "AGUA_PAYLOAD":
            messageExtra(senderId);
        break;

        case "MISTERIOSA_PAYLOAD":
            messageExtra(senderId);
        break;



        case "SI_JOVEN_PAYLOAD": 
            extrasPizza(senderId);
        break;

        case "BOLLOS_PAYLOAD":
            getLocation(senderId);
        break;

        case "DEDOS_PAYLOAD":
            getLocation(senderId);
        break;


        case "NO_JOVEN_PAYLOAD":
            getLocation(senderId);
        break;

            
        case "LOCATION_PAYLOAD":
            receipt(senderId);
        break;
    }
}

function senderActions(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
            "sender_action": "typing_on"
    }
    callSendApi(messageData);
}

function handleAttachments(senderId, event) {
    let attachment_type = event.attachments[0].type;
    switch (attachment_type){
        case "image":
            console.log(attachment_type);
        break;
        case "video":
            console.log(attachment_type);
        break;
        case "audio":
            console.log(attachment_type);
        break;
        case "video":
            console.log(attachment_type);
        break;
        case "location": 
            console.log(JSON.stringify(event))
        default:
            console.log(attachment_type);
        break;
    }
}

function callSendApi(response){ 
    request({
        "uri": "https://graph.facebook.com/v3.3/me/messages/",
        "qs": {
            "access_token": access_token
        },
        "method": "POST",
        "json":response
    },
    
    function(err){
        if (err){
            console.log('Ha ocurrido un error')
        } else {
            console.log('Mensaje enviado')
        }
    }
)
}

function showDrinks(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Refresco 2L",
                            "subtitle": "Excelente para acompañar cualquiera de nuestras pizzas",
                            "image_url": "https://thumbs.dreamstime.com/b/botellas-de-refrescos-globales-clasificados-93282709.jpg",
                            "buttons": [
                                {
                                    "title": "Quiero refresco 😍",
                                    "type": "postback",
                                    "payload": "REFRESCO_PAYLOAD"
                                }
                            ]
                        },
                        {
                            "title": "Agua de sabor",
                            "subtitle": "La mejor agua, que pugpizza te ofrece. sabemos que te encantara",
                            "image_url": "https://i.blogs.es/bdcb3f/14023167149_65e9243e29_k/450_1000.jpg",
                            "buttons": [
                                {
                                    "title": "Quiero agua 😍",
                                    "type": "postback",
                                    "payload": "AGUA_PAYLOAD"
                                }
                            ]
                        },
                        {
                            "title": "Solo quiero la pizza",
                            "subtitle": "Quiero la caja misteriosa",
                            "image_url": "https://eldiadehoy.net/wp-content/uploads/2016/09/caja-simpsons.jpg",
                            "buttons": [
                                {
                                    "title": "Quiero agua 😍",
                                    "type": "postback",
                                    "payload": "MISTERIOSA_PAYLOAD"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    senderActions(senderId);
    callSendApi(messageData);
}

function messageExtra(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "Te gustaria agregar mas sabor a tu pizza?, Con bollos de canela y dedos de queso" ,
            "quick_replies":
            [
                {
                    "content_type": "text",
                    "title": "Claro que si joven",
                    "payload": "SI_JOVEN_PAYLOAD"
                },
                {
                    "content_type": "text",
                    "title": "Ahora no joven",
                    "payload": "NO_JOVEN_PAYLOAD"
                }
            ]
        }
    }
    senderActions(senderId);
    callSendApi(messageData);
}

function extrasPizza(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Bollos de canela",
                            "subtitle": "Los mejores bollos de canela de todo Medellín",
                            "image_url": "https://www.petitchef.es/imgupl/recipe/bollos-de-canela--md-23649p29288.jpg",
                            "buttons": [
                                {
                                    "title": "Quiero los bollos",
                                    "type": "postback",
                                    "payload": "BOLLOS_PAYLOAD"
                                }
                            ]
                        },
                        {
                            "title": "Dedos de queso",
                            "subtitle": "El mejor sabor y la mejor conbinación, queso y pizza",
                            "image_url": "https://www.cocinavital.mx/wp-content/uploads/2017/07/receta-de-dedos-de-queso.jpg",
                            "buttons": [
                                {
                                    "title": "Quiero los dedos",
                                    "type": "postback",
                                    "payload": "DEDOS_PAYLOAD"
                                }
                            ]
                        },
                    ]
                }
            }
        }
    }
    senderActions(senderId)
    callSendApi(messageData)
}

function showPizzas(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
            "message": { 
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Peperoni", 
                                "subtitle": "Con todo el sabor del peperoni",
                                "image_url": "https://placeralplato.com/files/2016/01/Pizza-con-pepperoni.jpg",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Elegir Peperoni",
                                        "payload": "PEPERONI_PAYLOAD"
                                    }
                                ]
                            },
                            {
                                "title": "Pollo BBQ", 
                                "subtitle": "Con todo el sabor de la BBQ",
                                "image_url": "https://media-cdn.tripadvisor.com/media/photo-s/10/62/65/45/pizza-pollo-bbq.jpg",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Elegir pollo BBQ",
                                        "payload": "BBQ_PAYLOAD"
                                    }
                                ]
                            },
                            {
                                "title": "Hawaiana", 
                                "subtitle": "Con todo el sabor de la piña",
                                "image_url": "http://static.t13.cl/images/sizes/1200x675/1497060167-pizza-con-pia.jpg",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Elegir Hawaiana",
                                        "payload": "HAWAIANA_PAYLOAD"
                                    }
                                ]
                            },
                            {
                                "title": "Mexicana", 
                                "subtitle": "Con todo el sabor que caracteriza a nuestro país",
                                "image_url": "http://www.amaretos.com/wp-content/uploads/2016/09/Mexicana.jpg",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Elegir Hawaiana",
                                        "payload": "MEXICANA_PAYLOAD"
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
    }
    callSendApi(messageData)
}

function messageImage(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": { 
                "type": "image",
                "payload": {
                    "url": "https://media.giphy.com/media/1dOIvm5ynwYolB2Xlh/giphy.gif"
                }
            }
        }
    }
    senderActions(senderId);
    callSendApi(messageData);
}

function contactSupport(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "Hola este es el canal de soporte, ¿quieres llamarnos?",
                    "buttons": [
                        {
                            "type": "phone_number",
                            "title": "Llamar a un asesor",
                            "payload": "+527911028540"
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

function showLocation(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "list",
                    "top_element_style": "compact",
                    "elements": [
                        {
                            "title": "Sucursal México",
                            "image_url": "https://s3-eu-west-1.amazonaws.com/iya-ghost-prod.inyourarea.co.uk/2018/04/German-Doner-Kebeb_270418--4-.jpg",
                            "subtitle": "Lindero la presa #10",
                            "buttons": [
                                {
                                    "title": "Ver en el mapa",
                                    "type": "web_url",
                                    "url": "https://goo.gl/maps/KoUW2sa1afuWjRiW6",
                                    "webview_height_ratio": "full"
                                }
                            ]
                        },
                        {
                            "title": "Sucursal Colombia",
                            "image_url": "https://s3-eu-west-1.amazonaws.com/iya-ghost-prod.inyourarea.co.uk/2018/04/German-Doner-Kebeb_270418--4-.jpg",
                            "subtitle": "Muy muy lejano casa de burro",
                            "buttons": [
                                {
                                    "title": "Ver en el mapa",
                                    "type": "web_url",
                                    "url": "https://goo.gl/maps/KoUW2sa1afuWjRiW6",
                                    "webview_height_ratio": "tall"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData)
}

function sizePizza(senderId) {
    const messageData = {
      "recipient": {
        "id": senderId
      },
      "message": {
        "attachment": {
          "type": "template",

          "payload": {
            "template_type": "list",
            "top_element_style": "compact",
            "elements": [
              {
                "title": "Individual",
                "image_url": "http://www.amaretos.com/wp-content/uploads/2016/09/Mexicana.jpg",
                "subtitle": "porcion Individual de Pizza con bareta",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Elegir Individual",
                    "payload": "PERSONAL_SIZE_PAYLOAD",
                  }
                ]
              },
              {
                "title": "Mediana",
                "image_url": "http://static.t13.cl/images/sizes/1200x675/1497060167-pizza-con-pia.jpg",
                "subtitle": "porcion Mediana de Pizza con bareta",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Elegir Mediana",
                    "payload": "MEDIUM_SIZE_PAYLOAD",
                  }
                ]
              },
              {
                "title": "Familiar",
                "image_url": "http://static.t13.cl/images/sizes/1200x675/1546970493-pizza-30073951280.jpg",
                "subtitle": "Porcion ideal para compartir con la familia o para los amantes extremos de la pizza",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Elegir Mediana",
                    "payload": "FAMILIAR_SIZE_PAYLOAD",
                  }
                ]
              }
            ]
          }
        }
      }
    }
    senderActions(senderId);
    callSendApi(messageData);
}

function receipt(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "receipt",
                    "recipient_name": "Miguel Jardinez",
                    "order_number": "123123",
                    "currency": "MXN",
                    "payment_method": "Efectivo",
                    "order_url": "https://platzi.com/order/123",
                    "timestamp": "123123123",
                    "address": {
                        "street_1": "Lindero la presa, 10",
                        "street_2": "---",
                        "city": "Mexico",
                        "postal_code": "543135",
                        "state": "Hidalgo",
                        "country": "Mexico"
                    },
                    "summary": {
                        "subtotal": 12.00,
                        "shipping_cost": 2.00,
                        "total_tax": 1.00,
                        "total_cost": 15.00 
                    },
                    "adjustments": [
                        {
                            "name": "descuento frecuente",
                            "amount": -1.00
                        }
                    ],
                    "elements": [
                        {
                            "title": "pizza de peperoni",
                            "subtitle": "La mejor pizza de peperoni",
                            "quantity": 1,
                            "price": 10.00,
                            "currency": "MXN",
                            "image_url": "http://www.amaretos.com/wp-content/uploads/2016/09/Mexicana.jpg"
                        },
                        {
                            "title": "Bebida",
                            "subtitle": "Caja secreta",
                            "quantity": 1,
                            "price": 2.00,
                            "currency": "MXN",
                            "image_url": "https://eldiadehoy.net/wp-content/uploads/2016/09/caja-simpsons.jpg"
                        }
                    ]
                }
            }
        }
    }
    senderActions(senderId);
    callSendApi(messageData);
}

function getLocation(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "Perfecto, ¿Podiras proporcionarnos tu ubicación? para saber en donde mandarte la pizza",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Enviar Ubicacion",
                    "payload": "LOCATION_PAYLOAD"
                }
            ]
        }
    }
    callSendApi(messageData);
}

app.listen(app.get('port'), function(){
    console.log('Nuestro servidor esta funcionando en el puerto', app.get('port'));
})
