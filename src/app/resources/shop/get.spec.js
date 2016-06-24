
describe('resources/shop/get', () => {
    let mock
    let getShop

    beforeEach(() => {
        mock = {
            'app/lib/constants': {
                interpolateConstant: jasmine.createSpy('interpolate constant spy').and.returnValue(`fake-get-endpoint`)
            },
            'app/lib/http': {
                http: {
                    get: jasmine.createSpy('http get spy')
                }
            }
        }
        getShop = require('inject!./get')(mock).getShop
    })

    it('should call http with the COMMISSIONING_ENDPOINT_SHOP constant', () => {
        getShop({
          shopId: 'my-shop-id',
        })
        expect(mock['app/lib/constants'].interpolateConstant).toHaveBeenCalledWith('COMMISSIONING_ENDPOINT_SHOP', {
          shopId: 'my-shop-id'
        })
        expect(mock['app/lib/http'].http.get).toHaveBeenCalledWith('fake-get-endpoint')
    })
})