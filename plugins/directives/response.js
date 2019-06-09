import Vue from 'vue';

const response = {
  bind(el, binding) {
    function responser(event, element) {
      const responseContainer = document.createElement('span');
      responseContainer.classList.add('aui-response');
      element.appendChild(responseContainer);
      // add masked
      if (binding.modifiers.masked) {
        responseContainer.classList.add('aui-response--masked');
      }
      const responseEffect = document.createElement('span');
      responseEffect.classList.add('aui-response__effect');
      if (binding.modifiers.large) {
        responseEffect.classList.add('aui-response__effect--large');
      }
      if (binding.modifiers.small) {
        responseEffect.classList.add('aui-response__effect--small');
      }
      responseContainer.appendChild(responseEffect);

      const target = event.currentTarget || event.srcElement;
      const rect = target.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      if (!binding.value) {
        responseEffect.style.left = `${offsetX}px`;
        responseEffect.style.top = `${offsetY}px`;
        if (binding.modifiers.fast) {
          responseContainer.classList.add('is-animating-fast');
        } else {
          responseContainer.classList.add('is-animating');
        }
      }

      setTimeout(() => {
        responseContainer.parentNode.removeChild(responseContainer);
      }, 850);
    }

    el.addEventListener('mousedown', event => responser(event, el, binding.value));
  },
};

Vue.directive('response', response);
