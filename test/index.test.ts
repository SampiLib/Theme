window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addEventListener: function () { },
        removeEventListener: function () { },
        dispatchEvent: function () { },
    };
};
import { describe, it, expect, beforeEach } from '@jest/globals';
import { registerDocument, registerVariable } from '../src';

// describe('theme', function () {
//     it('register theme variable', function () {
//         registerDocument(document);
//         registerVariable('test', 'd', 'b');
//         console.log(document.documentElement.style);
//         expect(document.documentElement.style.getPropertyValue('test')).toBe('d');
//     });
// });


