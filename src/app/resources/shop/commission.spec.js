
describe('resources/shop/commission', () => {
    let mock
    let commission

    beforeEach(() => {
        mock = {
            'app/lib/constants': {
                getConstant: jasmine.createSpy('get constant spy').and.returnValue(`fake-commission-endpoint`)
            },
            'app/lib/http': {
                http: {
                    post: jasmine.createSpy('http get spy')
                }
            }
        }
        commission = require('inject!./commission')(mock).commission
    })

    it('should call http with the COMMISSIONING_ENDPOINT_COMMISSION constant', () => {
        commission({
          shopId: 'my-shop-id',
          dallasId: 'my-dallas-id'
        })
        expect(mock['app/lib/constants'].getConstant).toHaveBeenCalledWith('COMMISSIONING_ENDPOINT_COMMISSION')
        expect(mock['app/lib/http'].http.post).toHaveBeenCalledWith('fake-commission-endpoint', {
          shopId: 'my-shop-id',
          dallasId: 'my-dallas-id'
        })
    })
})