const wallet = require('../models/wallet')
const transaction = require('../models/transaction')
const user = require('../models/users')
const random = require('random')
const transporter = require("../middlewares/sendMail")
//get recharge
exports.getRecharge = (req, res) => {
    return res.json({
        code: 0,
        message: "Get recharge success"
    })
}

// Post recharge
exports.postRecharge = async (req, res) => {
    // thay params banh session.id
    let id = new Object(req.params.id)
    userWallett = await wallet.findOne({ userId: id })
    let { amount, soThe, deadline, cvvCode } = req.body;
    if (!amount || !soThe || !deadline || !cvvCode) {
        return res.json({
            code: 2,
            message: 'Thieu thong tin'
        })
    }
    if (soThe === '111111' && deadline === '10/10/2022' && cvvCode === '411') {
        userWallett.balance = userWallett.balance + parseInt(amount);
        userWallett.save().then(() => {

            let trans = new transaction({
                userId: id,
                amount: parseInt(amount),
                recepientId: String(id),
                timeStamps: getDate(),
                status: "Đã chuyển",
                description: "Nạp tiền",
                action: "NT"
            })
            trans.save().then(() => {
                return res.json({
                    code: 0,
                    message: 'Nap tien thanh cong',
                    transacion: trans
                })
            })
        })

    } else if (soThe === '222222' && deadline === '11/11/2022' && cvvCode === '443') {
        if (amount > 1000000) {
            return res.json({
                code: 1,
                message: 'The nay chi dc nap nhieu nhat 1tr/lan'
            })
        } else {
            userWallett.balance = userWallett.balance + parseInt(amount);
            userWallett.save().then(() => {

                let trans = new transaction({
                    userId: id,
                    amount: parseInt(amount),
                    recepientId: String(id),
                    timeStamps: getDate(),
                    status: "Đã chuyển",
                    description: "Nạp tiền",
                    action: 'NT'
                })
                trans.save().then(() => {
                    return res.json({
                        code: 0,
                        message: 'Nap tien thanh cong',
                        transacion: trans
                    })
                })
            })
        }
    } else if (soThe === '333333' && deadline === '12/12/2022' && cvvCode === '577') {
        return res.json({
            code: 1,
            message: 'The nay kh nap duoc tien'
        })
    } else {
        return res.json({
            code: 1,
            message: 'Thong tin the bi sai moi dieu chinh lai cho phu hop'
        })
    }

}
// get withdraw
exports.getWithdraw = async (req, res) => {
    return res.json({
        code: 0,
        message: "Get withdraw success"
    })
}
// post withdraw
exports.postWithdraw = async (req, res) => {
    let { amount, soThe, deadline, cvvCode, description } = req.body;
    if (!amount || !soThe || !deadline || !cvvCode) {
        return res.json({
            code: 2,
            message: 'Thieu thong tin'
        })
    } else if (soThe === '111111' && deadline === '10/10/2022' && cvvCode === '411') {
        // thay bằng session
        let id = new Object(req.params.id)
        userWallett = await wallet.findOne({ userId: id })
        let trans = new transaction({
            userId: id,
            amount: parseInt(amount),
            recepientId: "",
            timeStamps: getDate(),
            status: "",
            description: description,
            action: 'RT'
        })
        if (amount >= 5000000) {
            if (userWallett.countWithdraw > 0) {
                let sumAmount = parseInt(amount) * 1.05
                userWallett.countWithdraw = userWallett.countWithdraw - 1
                userWallett.balance = userWallett.balance - sumAmount;
                trans.amount = sumAmount
                trans.status = "Chờ xác nhận"
                userWallett.save().then(() => {
                    trans.save().then(() => {
                        return res.json({
                            code: 0,
                            message: 'Dang cho xac nhan',
                            transacion: trans
                        })
                    }).catch(e => console.log(e))
                })
            } else {
                return res.json({
                    code: 1,
                    message: 'Het so lan rut tien'
                })
            }

        } else {
            if (userWallett.countWithdraw > 0) {
                trans.status = "success"
                trans.action = 'RT'
                let sumAmount = parseInt(amount) * 1.05
                userWallett.balance = userWallett.balance - sumAmount;
                userWallett.countWithdraw = userWallett.countWithdraw - 1
                userWallett.save().then(() => {
                    trans.amount = sumAmount
                    trans.status = "Đã rút thành công"
                    trans.save().then(() => {
                        return res.json({
                            code: 0,
                            message: 'Rut tien thanh cong',
                            transacion: trans
                        })
                    }).catch(e => console.log(e))
                })
            } else {
                return res.json({
                    code: 1,
                    message: 'Het so lan rut tien'
                })
            }

        }
    } else {
        return res.json({
            code: 1,
            message: 'Thong tin the bi sai moi dieu chinh lai cho phu hop'
        })
    }


}

exports.getTransfer = (req, res) => {
    return res.json({
        code: 0,
        message: "Get transfer success"
    })
}
exports.postTransfer = async (req, res) => {
    idSender = new Object(req.params.id)
    let { numReceiver, desc, nameReceiver, amount, checkFee } = req.body
    if (!numReceiver || !desc || !nameReceiver || !amount) {
        return res.json({
            code: 2,
            message: 'Thieu thong tin'
        })
    } else {
        infoSender = await user.findOne({ _id: idSender })
        walletSender = await wallet.findOne({ userId: idSender })
        infoReceiver = await user.findOne({ phoneNumber: numReceiver });
        walletReceiver = await wallet.findOne({ userId: infoReceiver._id })
        if (infoReceiver === null) {
            return res.json({
                code: 1,
                message: 'khong tim thay nguoi nhan'
            })
        } else if (amount > (parseInt(walletSender.balance + 100000))) {
            return res.json({
                code: 1,
                message: 'Tiền của bạn đã hết mời nạp thêm'
            })
        }
        else if (amount > 5000000) {
            let sumAmount
            if (checkFee) {
                sumAmount = amount * 0.95
                walletSender.balance = walletSender.balance - amount
            } else {
                sumAmount = amount * 1.05
                walletSender.balance = walletSender.balance - sumAmount

            }
            let transfer = new transaction({
                userId: idSender,
                amount: sumAmount,
                recepientId: infoReceiver._id,
                timeStamps: getDate(),
                status: "Chờ xác nhận ct",
                description: desc,
                action: 'CT'
            })
            transfer.save().then(() => {
                walletSender.save().then(() => {

                    return res.json({
                        code: 0,
                        message: 'Chờ xác nhận',
                        data: transfer
                    })


                })

            }).catch(e => console.log(e))
        } else {
            let sumAmount
            if (checkFee) {
                sumAmount = amount * 0.95
                walletSender.balance = walletSender.balance - amount
                walletReceiver.balance = walletReceiver.balance + sumAmount
            } else {
                sumAmount = amount * 1.05
                walletSender.balance = walletSender.balance - sumAmount
                walletReceiver.balance = walletReceiver.balance + amount
            }


            let transfer = new transaction({
                userId: idSender,
                amount: sumAmount,
                recepientId: infoReceiver._id,
                timeStamps: getDate(),
                status: "đã chuyển",
                description: desc,
                action: 'CT'
            })
            transfer.save().then(() => {
                walletSender.save().then(() => {
                    walletReceiver.save().then(() => {
                        return res.json({
                            code: 0,
                            message: 'Chờ xác nhận',
                            data: transfer
                        })
                    })
                })


            }).catch(e => console.log(e))
        }


    }
}
exports.getBuyCard = (req, res) => {
    return res.json({
        code: 0,
        message: "Get Buy Card success"
    })
}
exports.postBuyCard = async (req, res) => {
    id = new Object(req.params.id)
    userWallet = await wallet.findOne({ userId: id })
    let { nha_mang, menh_gia, qty } = req.body
    if (!nha_mang || !menh_gia || !qty) {
        return res.json({
            code: 1,
            message: 'Thieu thong tin'
        })
    }
    else {
        amount = parseInt(menh_gia) * parseInt(qty)
        if (amount > (parseInt(userWallet.balance + 100000))) {
            return res.json({
                code: 1,
                message: 'Tiền của bạn đã hết mời nạp thêm'
            })
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
                return res.json({
                    code: 1,
                    message: "Khong cung cap nha mang nay"
                })
            }

            let buyCard = new transaction({
                userId: id,
                amount: amount,
                recepientId: id,
                timeStamps: getDate(),
                status: "Mua thành công",
                description: 'Mua thẻ',
                codeCard: codeCard,
                action: 'BC'
            })
            userWallet.balance = userWallet.balance - amount
            buyCard.save()
                .then(() => {
                    userWallet.save()
                        .then(() => {
                            return res.json({
                                code: 0,
                                message: "Mua thanh cong",
                                data: buyCard,
                                userWallet: userWallet
                            })
                        })
                })
                .catch(e => console.log(e))
        }
    }
}



exports.getTransaction = async (req, res) => {
    id = new Object(req.params.id)
    userTrans = await transaction.find({ userId: id })
    return res.json({
        code: 0,
        messag: 'Thanh cong',
        data: userTrans
    })

}



// get date
function getDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    return today
}