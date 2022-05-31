const wallet = require('../models/wallet')
const transaction = require('../models/transaction')
const user = require('../models/users')
const random = require('random')
const transporter = require("../middlewares/sendMail")
const { validationResult } = require('express-validator')
const { v1: uuidv1 } = require('uuid');
var randomstring = require("randomstring");
const { use } = require('../middlewares/sendMail')
//get recharge
exports.getRecharge = (req, res) => {
    res.locals.account = req.session.account
    res.render('recharge', { amount: '', soThe: '', deadline: '', cvvCode: '', message: '', success: '' })
}

// Post recharge
exports.postRecharge = async (req, res) => {
    // thay params bang session.id
    let account = req.session.account
    let id = new Object(account._id)
    let result = validationResult(req)
    let codeTrans = uuidv1()
    userWallett = await wallet.findOne({ userId: id })
    let { amount, soThe, deadline, cvvCode } = req.body;
    if (result.errors.length === 0) {
        if (soThe === '111111' && deadline === '10/10/2022' && cvvCode === '411') {
            userWallett.balance = userWallett.balance + parseInt(amount);
            userWallett.save().then(() => {

                let trans = new transaction({
                    userId: id,
                    amount: parseInt(amount),
                    fee: 0,
                    recepientId: "",
                    status: "Thành công",
                    description: "Nạp tiền",
                    action: "NT",
                    codeTrans:codeTrans
                    })
                trans.save().then(() => {
                    return res.render('recharge', { amount: '', soThe: '', deadline: '', cvvCode: '', message: '', success: 'Nạp thành công' })
                })
            })

        } else if (soThe === '222222' && deadline === '11/11/2022' && cvvCode === '443') {
            if (amount > 1000000) {
                return res.render('recharge', { amount: amount, soThe: soThe, deadline: deadline, cvvCode: cvvCode, message: 'Thẻ này chỉ nạp nhiều nhất 1 triệu', success: '' })
            } else {
                userWallett.balance = userWallett.balance + parseInt(amount);
                userWallett.save().then(() => {

                    let trans = new transaction({
                        userId: id,
                        amount: parseInt(amount),
                        fee : 0,
                        recepientId: "",
                        status: "Thành công",
                        description: "Nạp tiền",
                        action: 'NT',
                        codeTrans:codeTrans
                    })
                    trans.save().then(() => {
                        return res.render('recharge', { amount: '', soThe: '', deadline: '', cvvCode: '', message: '', success: 'Nạp thành công' })
                    })
                })
            }
        } else if (soThe === '333333' && deadline === '12/12/2022' && cvvCode === '577') {
            return res.render('recharge', { amount: amount, soThe: soThe, deadline: deadline, cvvCode: cvvCode, message: 'Thẻ hết tiền', success: '' })
        } else {
            return res.render('recharge', { amount: amount, soThe: soThe, deadline: deadline, cvvCode: cvvCode, message: 'Thông tin thẻ bị sai', success: '' })
        }
    } else {
        return res.render('recharge', { amount: amount, soThe: soThe, deadline: deadline, cvvCode: cvvCode, message: result.errors[0].msg, success: '' })
    }


}
// get withdraw
exports.getWithdraw = async (req, res) => {
    res.locals.account = req.session.account
    return res.render('withdraw-money', { amount: '', soThe: '', deadline: '', description: '', cvvCode: '', message: '', success: '' })
}
// post withdraw
exports.postWithdraw = async (req, res) => {
    let codeTrans = uuidv1()
    let userFee = 0
    let account = req.session.account
    let id = new Object(account._id)
    let { amount, soThe, deadline, cvvCode, description } = req.body;
    result = validationResult(req)
    if (result.errors.length === 0) {
        if (parseInt(amount) % 50000 !== 0) {
            return res.render('withdraw-money', { amount, soThe, deadline, cvvCode, description, message: 'Cần phải rút bội số của 50000', success: '' })
        } else if (soThe === '111111' && deadline === '10/10/2022' && cvvCode === '411') {
            // thay bằng session
            userWallett = await wallet.findOne({ userId: id })
            let fee = parseInt(amount) * 0.05
            let trans = new transaction({
                userId: id,
                amount: parseInt(amount),
                fee: fee,
                userFee: userFee,
                recepientId: "",
                status: "",
                description: description,
                action: 'RT',
                codeTrans:codeTrans
            })
            if (parseInt(amount) >= 5000000) {
                if (userWallett.countWithdraw > 0) {
                    userWallett.countWithdraw = userWallett.countWithdraw - 1
                    userWallett.balance = userWallett.balance - parseInt(amount) - fee;
                    trans.status = "đang chờ"
                    userWallett.save().then(() => {
                        trans.save().then(() => {
                            return res.render('withdraw-money', { amount: '', soThe: '', deadline: '', cvvCode: '', description: '', message: '', success: 'Đang chờ xác nhận' })
                        }).catch(e => console.log(e))
                    })
                } else {
                    return res.render('withdraw-money', { amount, soThe, deadline, cvvCode, description, message: 'Tài khoản này đã hết số lần rút', success: '' })
                }

            } else {
                if (userWallett.countWithdraw > 0) {
                    userWallett.balance = userWallett.balance - parseInt(amount) - fee;
                    userWallett.countWithdraw = userWallett.countWithdraw - 1
                    userWallett.save().then(() => {
                        trans.status = "Thành công"
                        trans.save().then(() => {
                            return res.render('withdraw-money', { amount: '', soThe: '', deadline: '', cvvCode: '', description: '', message: '', success: 'Rút tiền thành công' })
                        }).catch(e => console.log(e))
                    })
                } else {
                    return res.render('withdraw-money', { amount, soThe, deadline, cvvCode, description, message: 'Tài khoản này đã hết số lần rút', success: '' })
                }

            }
        } else {
            return res.render('withdraw-money', { amount, soThe, deadline, cvvCode, description, message: 'Thông tin thẻ bị sai', success: '' })
        }
    } else {
        return res.render('withdraw-money', { amount: amount, soThe: soThe, deadline: deadline, cvvCode: cvvCode, description: '', message: result.errors[0].msg, success: '' })
    }


}

exports.getTransfer = (req, res) => {
    res.locals.account = req.session.account
    return res.render('transfer', { numReceiver: '', desc: '', amount: '', checkFee: '', message: '', success: '' })

}
exports.postTransfer = async (req, res) => {
    let codeTrans = uuidv1()
    account = req.session.account
    idSender = account._id
    let { numReceiver, desc, amount, checkFee } = req.body
    let result = validationResult(req)
    if (result.errors.length !== 0) {
        return res.render('transfer', { numReceiver, desc, amount, checkFee, message: result.errors[0].msg, success: '' })
    } else {
        let userFee = 0;
        fee = parseInt(amount)*0.05
        infoSender = await user.findOne({ _id: idSender })
        walletSender = await wallet.findOne({ userId: idSender })
        infoReceiver = await user.findOne({ phoneNumber: numReceiver });
        if (!infoReceiver) {
            return res.render('transfer', { numReceiver, desc, amount, checkFee, message: 'Không tìm thấy người dùng', success: '' })
        } else {
            walletReceiver = await wallet.findOne({ userId: infoReceiver._id })
            if (amount > (parseInt(walletSender.balance) + 100000)) {
                return res.render('transfer', { numReceiver, desc, amount, checkFee, message: 'Tiền của bạn không đủ', success: '' })
            }
            else if (amount >= 5000000) {
                if (checkFee) {
                    userFee = 1
                }
                let transfer = new transaction({
                    userId: idSender,
                    amount: amount,
                    fee:fee,
                    userFee: userFee,
                    recepientId: infoReceiver._id,
                    status: "đang chờ",
                    description: desc,
                    action: 'CT',
                    codeTrans:codeTrans
                })
                transfer.save().then(() => {
                    walletSender.save().then(() => {

                        return res.render('transfer', { numReceiver: '', desc: '', amount: '', checkFee: '', message: '', success: 'Chờ xác nhận giao dịch' })


                    })

                }).catch(e => console.log(e))
            } else {
                let sumAmount
                if (checkFee) {
                    userFee = 1;
                    walletSender.balance = parseInt(walletSender.balance) - parseInt(amount)
                    walletReceiver.balance = parseInt(walletReceiver.balance) + parseInt(amount)*0.95
                } else {
                    sumAmount =parseInt(amount) * 1.05
                    walletSender.balance = parseInt(walletSender.balance) - sumAmount
                    walletReceiver.balance = parseInt(walletReceiver.balance) + parseInt(amount) 
                }


                let transfer = new transaction({
                    userId: idSender,
                    amount: amount,
                    fee : fee,
                    userFee:userFee,
                    recepientId: infoReceiver._id,
                    status: "Thành công",
                    description: desc,
                    action: 'CT',
                    codeTrans:codeTrans
                })
                transfer.save().then(() => {
                    walletSender.save().then(() => {
                        walletReceiver.save().then(() => {
                            return res.render('transfer', { numReceiver: '', desc: '', amount: '', checkFee: '', message: '', success: 'Giao dịch thành công' })
                        })
                    })


                }).catch(e => console.log(e))
            }
        }
    }
}
exports.getBuyCard = (req, res) => {
    res.locals.account = req.session.account
    return res.render('buy-phone-card', { message: '', success: '' })
}
exports.postBuyCard = async (req, res) => {
    let codeTrans = uuidv1()
    account = req.session.account
    id = account._id
    let { nha_mang, menh_gia, qty } = req.body
    let result = validationResult(req)
    if (result.errors.length !== 0) {
        return res.render('buy-phone-card', { message: result.errors[0].msg, success: '' })
    }
    else {
        userWallet = await wallet.findOne({ userId: id })
        amount = parseInt(menh_gia) * parseInt(qty)
        if (amount > (parseInt(userWallet.balance + 100000))) {
            return res.render('buy-phone-card', { message: 'Tiền của bạn đã hết', success: '' })
        } else {
            let codeCard = []
            if (nha_mang === "Viettel") {
                for (i = 0; i < qty; i++) {
                    a = '11111' + String(random.int((min = 1000), (max = 9999)))
                    codeCard.push(a)
                }
            } else if (nha_mang === 'Mobifone') {
                for (i = 0; i < qty; i++) {
                    a = '22222' + String(random.int((min = 1000), (max = 9999)))
                    codeCard.push(a)
                }
            } else if (nha_mang === 'Vinaphone') {
                for (i = 0; i < qty; i++) {
                    a = '33333' + String(random.int((min = 1000), (max = 9999)))
                    codeCard.push(a)
                }
            } else {
                return res.render('buy-phone-card', { message: 'Bạn chưa mệnh giá hoặc nhà mạng', success: '' })
            }
            let buyCard = new transaction({
                userId: id,
                amount: amount,
                fee:0,
                recepientId:"",
                status: "Thành công",
                description: 'Mua thẻ',
                codeCard: codeCard,
                action: 'BC',
                codeTrans: codeTrans

            })
            userWallet.balance = userWallet.balance - amount
            buyCard.save()
                .then(() => {
                    userWallet.save()
                        .then(() => {
                            return res.redirect(`/wallet/buycard-detail/${codeTrans}`)
                        })
                })
                .catch(e => console.log(e))
        }
    }
}
exports.getBuyCardDetail = async (req, res) => {
    res.locals.account = req.session.account
    let codeTrans = req.params.id
    buyCard = await transaction.findOne({ codeTrans: codeTrans })
    let code = buyCard.codeCard[0].substring(0, 5)
    let nha_mang
    let qty = buyCard.codeCard.length
    let amount = buyCard.amount
    let don_gia = amount / qty

    if (code == '11111') {
        nha_mang = 'Viettel'
    } else if (code == '22222') {
        nha_mang = 'Mobifone'
    } else if (code == '33333') {
        nha_mang = 'Vinaphone'
    }
    let dateObj = buyCard.timeStamps
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    newdate = day + "/" + month + "/" + year;

    return res.render('phone-card-details', { nha_mang, don_gia, qty, amount, codeTrans,newdate,codeCard:buyCard.codeCard})

}



exports.getTransaction = async (req, res) => {
    res.locals.account = req.session.account
    let account = req.session.account
    userTrans = await transaction.find({
        $or: [
            {
                $and: [
                    {
                        recepientId: String(account._id)
                    },
                    {
                        status:'Thành công'
                    }
                ]
            },
            {
                userId: account._id
            }
        ]
    }).sort({timeStamps: -1})
    return res.render('transaction-hisrory',{userTrans})

}
exports.getDetailTransfer = async (req,res) => {
    res.locals.account = req.session.account
    let id = req.params.id
    let transfer = await transaction.findOne({codeTrans:id})
    let recepientId = transfer.recepientId
    let userReceiver = await user.findOne({_id : Object(recepientId)})
    return res.render('transaction-detail-CK',{transfer,userReceiver})
}
exports.getDetailRecharge = async (req,res) => {
    res.locals.account = req.session.account
    let id = req.params.id
    let recharge = await transaction.findOne({codeTrans:id})
    return res.render('transaction-detail-NT',{recharge})
}
exports.getDetailWithdraw = async (req,res) => {
    res.locals.account = req.session.account
    let id = req.params.id
    let withdraw = await transaction.findOne({codeTrans:id})
    return res.render('transaction-detail-RT',{withdraw})
}
exports.getDetailBuyCard = async (req,res) => {
    res.locals.account = req.session.account
    let id = req.params.id
    let buyCard = await transaction.findOne({codeTrans:id})
    return res.render('transaction-detail-DT',{buyCard})
}