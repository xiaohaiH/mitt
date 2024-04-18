
import nativeMitt from 'mitt';
import { Emitter, EventHandlerMap, EventType } from 'mitt';

export type * from 'mitt';

/** 基于 mitt 实现, 处理的 once 事件 */
function mitt<Events extends Record<EventType, unknown>>(all?: EventHandlerMap<Events>) {
    const _mitt = nativeMitt(all) as Emitter<Events> & { once: Emitter<Events>['on'] };
    const _off = _mitt.off;
    _mitt.once = function once(type: string, cb: (...args: any[]) => void) {
        function _cb(r: any) {
            cb(r);
            _off.call(_mitt, type as '*', _cb);
        }
        // @ts-expect-error 魔改监听事件
        cb.fn = _cb;
        _mitt.on(type, _cb);
    };
    _mitt.off = function off(type: string, cb: (...args: any[]) => void) {
        // @ts-expect-error 魔改注销事件
        _off.call(_mitt, type, cb && (cb.fn || cb));
    };
    return _mitt;
}

export default mitt;