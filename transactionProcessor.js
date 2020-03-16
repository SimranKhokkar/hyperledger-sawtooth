const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const transactionItem = require('./transactionItem');
const { InternalError, InvalidTransaction } = require('sawtooth-sdk').exceptions;
const { decodeData, hash, getNamespace } = require('./lib/helper');

const SW_FAMILY = 'first_TP';
const SW_NAMESPACE = getNamespace(SW_FAMILY);

class TPHandler extends TransactionHandler {
  constructor() {
    super(SW_FAMILY, ['1.0'], [SW_NAMESPACE]);
  }

  /**
 * This function is extended from the TransactionHandler to handle Transactions
 * @param {Object} transactionProcessRequest
 * @param {Object} context
 */

  // eslint-disable-next-line class-methods-use-this
  apply(transactionProcessRequest, context) {
    try {
      console.log('transactionProcessRequest', transactionProcessRequest);
      return decodeData(transactionProcessRequest.payload)
        .then((payload) => {
          const newPayload = payload;
          newPayload.data = payload.data;
          const TPItemObj = new transactionItem(
            context, newPayload, SW_NAMESPACE,
          );
          return TPItemObj.takeAction();
        })
        .then((addresses) => {
          if (addresses && addresses.length === 0) {
            throw new InternalError('State Error !');
          }
          else
          console.log(addresses);
        })
        .catch((err) => {
            throw new InternalError(err.message);
        });
    } catch (error) {
      throw new InternalError(error);
    }
  }
}

module.exports = TPHandler;