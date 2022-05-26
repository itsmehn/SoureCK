const wallet = require('../models/wallet')
const transaction = require('../models/transaction')
const user = require('../models/users')

exports.getRecharge = (req, res) => {
    return res.json({
        code: 0,
        message: "Get recharge success"
    })
}
exports.postRecharge = async (req, res) => {
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
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;
        userWallett.balance = userWallett.balance + parseInt(amount);
        userWallett.save().then(() => {

            let trans = new transaction({
                userId: id,
                amount: parseInt(amount),
                recepientId: String(id),
                timeStamps: today,
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
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;
            userWallett.balance = userWallett.balance + parseInt(amount);
            userWallett.save().then(() => {

                let trans = new transaction({
                    userId: id,
                    amount: parseInt(amount),
                    recepientId: String(id),
                    timeStamps: today,
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