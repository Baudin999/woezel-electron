<script>
  import { getContext } from "svelte";
  import { get as gg } from "svelte/store";
  import { get } from "./../Services/fetchWrapper";
  import Toggle from "./Toggle.svelte";

  export let fieldName;
  export let title;
  export let type = "input";
  export let options = [];
  export let validate = null;
  export let disabled = false;

  let isValid = null;
  let data = getContext("data");
  let errors = getContext("errors");
  let error;
  let labelName =
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1) + fieldName;

  let getValue = () => {
    var schema = $data; // a moving reference to internal objects within obj
    var pList = fieldName.split(".");
    var len = pList.length;
    for (var i = 0; i < len - 1; i++) {
      var elem = pList[i];
      if (!schema[elem]) schema[elem] = {};
      schema = schema[elem];
    }

    var value = schema[pList[len - 1]];
    if (value === 0 || value === false || value) {
      return value;
    } else {
      if (type === "number") return 0;
      else if (type === "checkbox") return false;
      else return "";
    }
  };

  function setValue(value) {
    var schema = $data; // a moving reference to internal objects within obj
    var pList = fieldName.split(".");
    var len = pList.length;
    for (var i = 0; i < len - 1; i++) {
      var elem = pList[i];
      if (!schema[elem]) schema[elem] = {};
      schema = schema[elem];
    }

    if (type === "checkbox") value = !!value;

    schema[pList[len - 1]] = value;
  }

  var timeout;
  const handleInput = event => {
    var value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    if (event.target.type === "number") {
      value = +value;
    }

    setValue(value == "" ? null : value);

    if (value == "" || value == null) isValid = null;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(async () => {
      if (validate && value) {
        var result = await get(validate + "/" + value);
        isValid = result.valid;
        error = !result.valid ? result.message : null;
      } else {
        isValid = error && error.length > 0;
      }
    }, 1000);

    // event.stopPropagation();
    // return false;
  };
</script>

<style>
  .form-field--container {
    margin-bottom: 0;
    display: block;
    position: relative;
    width: 100%;
    text-align: left;
  }
  .form-field {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    width: 100%;
  }
  .form-field input:not([type="checkbox"]),
  .form-field textarea,
  .form-field select {
    width: 100%;
  }
  .form-field label {
    font-weight: bold;
    padding-right: 5px;
    font-size: 1rem;
    display: block;
    padding-bottom: 0.3rem;
  }
  .form-field label:after {
    content: ":";
    display: inline-block;
  }

  .form-field i {
    position: absolute;
    right: -15px;
  }
  .form-field i.fa-check {
    color: green;
  }
  .form-field i.fa-times {
    color: red;
  }
</style>

{#if $data}
  {#if options && options.length && options.length > 0}
    <div class="form-field--container">
      <div class="form-field">
        <label for={labelName}>{title}</label>
        <select
          id={labelName}
          value={getValue()}
          {disabled}
          on:input={handleInput}
          on:blur={handleInput}
          class:invalid={isValid == false || !!$errors[fieldName]}>
          <option />
          {#each options as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </div>
      {#if $errors[fieldName]}
        <div class="error">{$errors[fieldName]}</div>
      {/if}
    </div>
  {:else if type === 'textarea'}
    <div class="form-field--container">
      <div class="form-field">
        <label for={labelName}>{title}</label>
        <textarea
          id={labelName}
          {disabled}
          value={getValue()}
          on:input={handleInput}
          on:change={handleInput}
          class:invalid={isValid == false || !!$errors[fieldName]} />
      </div>
      {#if $errors[fieldName]}
        <div class="error">{$errors[fieldName]}</div>
      {/if}
    </div>
  {:else if type == 'checkbox'}
    <div class="form-field">
      <label for={labelName}>{title}</label>
      <Toggle id={labelName} checked={getValue()} on:change={handleInput} />
    </div>
  {:else}
    <div class="form-field--container">
      <div class="form-field">
        <label for={labelName}>{title}</label>
        <input
          id={labelName}
          {type}
          value={getValue()}
          {disabled}
          on:input={handleInput}
          on:change={handleInput}
          class:invalid={isValid == false || !!$errors[fieldName]} />
        {#if isValid}
          <i class="fa fa-check" />
        {:else if isValid != null && isValid == false}
          <i class="fa fa-times" />
        {/if}

      </div>
      {#if $errors[fieldName]}
        <div class="error">{$errors[fieldName]}</div>
      {/if}
    </div>
  {/if}
{/if}

<!-- <pre>{JSON.stringify(errors || {})}</pre> -->
