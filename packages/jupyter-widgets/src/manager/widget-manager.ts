import { KernelMessage } from "@jupyterlab/services";
import * as base from "@jupyter-widgets/base";
import * as controls from "@jupyter-widgets/controls";
import {
  DOMWidgetView,
  WidgetModel,
  DOMWidgetModel
} from "@jupyter-widgets/base";
import { WidgetComm } from "./widget-comms";
import { RecordOf } from "immutable";
import {
  KernelNotStartedProps,
  LocalKernelProps,
  RemoteKernelProps
} from "@nteract/core";

interface IDomWidgetModel extends DOMWidgetModel {
  _model_name: string;
  _model_module: string;
  _module_version: string;
  _view_name: string;
  _view_module: string;
  _view_module_version: string;
}

/**
 * The WidgetManager extends the ManagerBase class and is required
 * by the ipywidgets implementation for rendering all models. This
 * WidgetManager contains some overrides to get it to play nice
 * with our RxJS-based kernel communication.
 */
export class WidgetManager extends base.ManagerBase<DOMWidgetView> {
  stateModelById: (id: string) => any;
  kernel:
    | RecordOf<KernelNotStartedProps>
    | RecordOf<LocalKernelProps>
    | RecordOf<RemoteKernelProps>
    | null;

  constructor(kernel: any, stateModelById: (id: string) => any) {
    super();
    this.kernel = kernel;
    this.stateModelById = stateModelById;
  }

  update(kernel: any, stateModelById: (id: string) => any) {
    this.kernel = kernel;
    this.stateModelById = stateModelById;
  }

  /**
   * Load a class and return a promise to the loaded object.
   */
  loadClass(className: string, moduleName: string, moduleVersion: string): any {
    return new Promise(function(resolve, reject) {
      if (moduleName === "@jupyter-widgets/controls") {
        resolve(controls);
      } else if (moduleName === "@jupyter-widgets/base") {
        resolve(base);
      } else {
        return Promise.reject(
          `Module ${moduleName}@${moduleVersion} not found`
        );
      }
    }).then(function(module: any) {
      if (module[className]) {
        return module[className];
      } else {
        return Promise.reject(
          `Class ${className} not found in module ${moduleName}@${moduleVersion}`
        );
      }
    });
  }

  /**
   * Get a promise for a model by model id.
   *
   * #### Notes
   * If a model is not found, this will lookup the model in nteracts
   * redux store using the model_comm_lookup funciton and create it
   */
  get_model(model_id: string): Promise<WidgetModel> | undefined {
    let model = super.get_model(model_id);
    if (model === undefined) {
      let model_state = this.stateModelById(model_id)
        .get("state")
        .toJS();
      model = this.new_widget_from_state_and_id(model_state, model_id);
    }
    return model;
  }

  /**
   * Shortcut to new_widget (creates the modelInfo from the state)
   * @param state
   * @param model_id
   */
  async new_widget_from_state_and_id(state: any, model_id: string) {
    let modelInfo = {
      model_id: model_id,
      model_name: state._model_name,
      model_module: state._model_module,
      model_module_version: state._module_version,
      view_name: state._view_name,
      view_module: state._view_module,
      view_module_version: state._view_module_version
    };
    return this.new_widget(modelInfo, state);
  }

  /**
   * Create a comm and new widget model.
   * @param  options - same options as new_model but comm is not
   *                          required and additional options are available.
   * @param  serialized_state - serialized model attributes.
   */
  new_widget(options: any, serialized_state: any = {}): Promise<WidgetModel> {
    //first we check if the model was already created
    let widget = super.get_model(options.model_id); //we need to use the super because we override get_model to create what it can't find
    if (!widget) {
      widget = super.new_widget(options, serialized_state);
    }
    return widget;
  }

  display_view(
    msg: KernelMessage.IMessage,
    view: base.DOMWidgetView,
    options: any
  ): Promise<base.DOMWidgetView> {
    return Promise.resolve(view);
  }

  _get_comm_info() {
    return Promise.resolve({});
  }

  /**
   * Create a comm which can be used for communication for a widget.
   *
   * If the data/metadata is passed in, open the comm before returning (i.e.,
   * send the comm_open message). If the data and metadata is undefined, we
   * want to reconstruct a comm that already exists in the kernel, so do not
   * open the comm by sending the comm_open message.
   *
   * @param comm_target_name Comm target name
   * @param model_id The comm id
   * @param data The initial data for the comm
   * @param metadata The metadata in the open message
   */
  _create_comm(
    comm_target_name: string,
    model_id: string,
    data?: any,
    metadata?: any,
    buffers?: ArrayBuffer[] | ArrayBufferView[]
  ) {
    //TODO: Check if we need to open a comm
    //TODO: Find a way to supply correct target module (only used in comm opens)
    if (this.kernel) {
      return Promise.resolve(
        new WidgetComm(
          model_id,
          this.comm_target_name,
          "<target module>",
          this.kernel
        )
      );
    } else {
      return Promise.reject("Kernel is null or undefined");
    }
  }

  /**
   * This method creates a view for a given model. It starts off
   * by registering a new model from the serialized model data. It
   * then uses the loadClass method to resolve a reference to the
   * WidgetView. Finally, it returns a reference to that Widget.
   * Note that we don't display the view here. Instead, we invoke
   * the `render` method on the WidgetView from within the
   * `BackboneWrapper` component and pass a reference to a React
   * element in this method.
   *
   * @param model   The Backbone-model associated with the widget
   * @param options Configuration options for rendering the widget
   */
  async create_view(model: any, options: any): Promise<DOMWidgetView> {
    const managerModel = await this.new_widget(
      {
        model_id: options.model_id,
        model_name: (model as IDomWidgetModel)._model_name,
        model_module: (model as IDomWidgetModel)._model_module,
        model_module_version: (model as IDomWidgetModel)._module_version,
        view_name: (model as IDomWidgetModel)._view_name,
        view_module: (model as IDomWidgetModel)._view_module,
        view_module_version: (model as IDomWidgetModel)._view_module_version
      },
      model
    );
    const WidgetView = await this.loadClass(
      managerModel.get("_view_name"),
      managerModel.get("_view_module"),
      managerModel.get("_view_module_version")
    );
    const widget = new WidgetView({
      model: managerModel,
      el: options.el
    });
    return widget;
  }
}
