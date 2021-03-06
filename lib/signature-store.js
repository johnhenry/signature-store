/**
 * Signature Store
 * Copyright(c) 2014 John Henry
 * MIT Licensed
 *
 * Store Digital Signatures to Prevent Replay Attacks
 * (PublicKey, Signature, and SignedURI).
 *
 * It is assumed that the a property "signature" has been set on the request object.
 * This middleware stores signatures for the explicit purpose of preventing
 * replay attacks.
 * This middleware also sets a property "newSignature" on the request object if this
 * is the first time a particular signature is used.
 * Vefification must be handled by other middleware

 * @param {Boolean} (required) options.db -- level database in which to store data
 * @param {Int} (optional) options.expiration = 0 -- amount of time to store
    signatures in milliseconds (0 = unlimited)
 * @param {reject} (optional) options.bitauth = false -- reject signature with 401status
    if not new
 * @param {Function} (optional) options.hash = null -- function to hash signature
 * @return {Function}
 * @api public
 */
module.exports = function(options){
    options = options || {
        hash    : null,
        reject  : false
    };
    var db = options.db;
    if(!db){
        throw("'db' option must be specified");
    }
    var expiration = Number(options.expiration) || 0;
    var hash = options.hash;
    return function(request, response, next) {
        var signature = request.signature || "";
        signature = options.hash ? options.hash(request.signature) : request.signature;
        request.newSignature = false;
        db.get(signature, function(error, value){
            var now = Number(Date.now());
            if(error.message.indexOf("Key not found in database") !== -1){
                error = null;
                value = now;
            }//key should be considered new if not found
            if(error && !signature && !options.reject){
                console.log("there", error)
                next();
                return;
            }
            if(error){
                response.status(401).json({error : error.toString()});
                return;
            }
            request.newSignature = (value && expiration > 0) ?
            (Number(value) + expiration > now) : !!value;
            //TODO: There shouldn't be a case where the value could be 0, since this is way passed the 70s, but...
            db.put(signature, now, function(error){
                if(options.reject && !request.newSignature){
                    response.setHeader("WWW-Authenticate","DigitalSignature realm=\"*\" domain=\" \" algorithm=\"ECDSA\"");
                    response.status(401).json({error : "signature not new"});
                    return;
                }
                next();
            });
        })
    };
}
