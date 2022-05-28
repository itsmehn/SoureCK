const wallet = require('../models/wallet')
const transaction = require('../models/transaction')
const user = require('../models/users')
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
                description: "Nạp tiền"
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
                    description: "Nạp tiền"
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
    console.log(amount, soThe, deadline, cvvCode)
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
            description: description
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




// get data
function getDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    return today
}